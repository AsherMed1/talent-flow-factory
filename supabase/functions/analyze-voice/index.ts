
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { applicationId, audioData } = await req.json();
    
    if (!applicationId || !audioData) {
      throw new Error('Missing applicationId or audioData');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing voice analysis for application:', applicationId);

    // Convert base64 audio to binary
    const binaryAudio = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
    
    // Step 1: Transcribe audio using Whisper
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('Transcription error:', errorText);
      throw new Error(`Transcription failed: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcription = transcriptionResult.text;

    console.log('Transcription completed:', transcription.substring(0, 100) + '...');

    // Step 2: Analyze the transcription using GPT
    const analysisPrompt = `
You are an expert HR recruiter evaluating a voice recording for an appointment setter position at a healthcare company. 

The candidate's voice recording transcription is:
"${transcription}"

Please provide a comprehensive analysis based on these criteria:

1. **Communication Clarity** (1-10): How clear and understandable is their speech?
2. **Professional Tone** (1-10): Do they sound professional and appropriate for a healthcare setting?
3. **Enthusiasm & Engagement** (1-10): Do they sound engaged and interested in the role?
4. **Language Proficiency** (1-10): How well do they use English (grammar, vocabulary, flow)?
5. **Appointment Setting Suitability** (1-10): Would they be effective at scheduling appointments over the phone?

Provide:
- An overall score from 1-10 (average of the 5 criteria)
- Detailed feedback (2-3 paragraphs) covering strengths and areas for improvement
- Specific recommendations for this candidate

Format your response as JSON:
{
  "overall_score": <number 1-10>,
  "detailed_feedback": "<string>",
  "criteria_scores": {
    "communication_clarity": <number>,
    "professional_tone": <number>,
    "enthusiasm": <number>,
    "language_proficiency": <number>,
    "appointment_setting_suitability": <number>
  }
}
`;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert HR recruiter. Respond only with valid JSON.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('Analysis error:', errorText);
      throw new Error(`Analysis failed: ${errorText}`);
    }

    const analysisResult = await analysisResponse.json();
    const analysisText = analysisResult.choices[0].message.content;
    
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', analysisText);
      throw new Error('Invalid analysis response format');
    }

    console.log('Analysis completed with score:', analysis.overall_score);

    // Step 3: Save results to database
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        voice_transcription: transcription,
        voice_analysis_score: Math.round(analysis.overall_score),
        voice_analysis_feedback: analysis.detailed_feedback,
        voice_analysis_completed_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to save analysis: ${updateError.message}`);
    }

    console.log('Voice analysis completed and saved for application:', applicationId);

    return new Response(
      JSON.stringify({
        success: true,
        transcription,
        analysis,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-voice function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
