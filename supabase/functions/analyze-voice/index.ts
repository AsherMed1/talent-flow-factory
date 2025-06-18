
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

    let audioBlob: Blob;

    // Check if audioData is a URL or base64 data
    if (typeof audioData === 'string' && (audioData.startsWith('http') || audioData.startsWith('https'))) {
      // It's a URL, fetch the audio file
      console.log('Fetching audio from URL:', audioData);
      const audioResponse = await fetch(audioData);
      if (!audioResponse.ok) {
        throw new Error(`Failed to fetch audio file: ${audioResponse.statusText}`);
      }
      audioBlob = await audioResponse.blob();
    } else {
      // It's base64 data, convert to blob
      console.log('Converting base64 audio data to blob');
      const binaryAudio = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
      audioBlob = new Blob([binaryAudio], { type: 'audio/webm' });
    }
    
    // Step 1: Transcribe audio using Whisper
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
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

    // Step 2: Analyze the transcription using GPT with role-specific criteria
    const analysisPrompt = `
You are evaluating a voice recording for a healthcare appointment setter position. This role requires someone who is warm, friendly, empathetic, and naturally conversational - NOT cold, clinical, or overly formal medical professional communication.

The ideal candidate should sound like someone patients would feel comfortable talking to - think of a caring friend or family member who happens to work in healthcare, not a distant medical professional.

The candidate's voice recording transcription is:
"${transcription}"

Evaluate them on these specific criteria for a warm healthcare appointment setter:

1. **Clarity** (1-10): How clear and easy to understand is their natural speaking voice? We want clear communication but not robotic pronunciation.

2. **Pacing** (1-10): Do they speak at a comfortable, conversational pace? Not rushed or too slow, with natural pauses that feel like genuine conversation.

3. **Tone** (1-10): How warm, caring, and approachable do they sound? We want genuine warmth and empathy, not clinical professionalism. Do they sound like someone you'd want to talk to when you're worried about your health?

4. **Energy** (1-10): Do they sound genuinely engaged and caring? We want natural enthusiasm and warmth, not high-energy sales pitch or flat medical delivery.

5. **Confidence** (1-10): Do they sound naturally confident and reassuring without being pushy? We want someone who sounds trustworthy and calming, with minimal hesitation that might make patients worry.

IMPORTANT: We are NOT looking for:
- Cold, clinical, medical professional tone
- Overly formal or robotic speech
- High-pressure sales energy
- Sterile healthcare communication

We ARE looking for:
- Warm, genuine human connection
- Natural conversational flow
- Empathetic and caring tone
- Someone who sounds like they genuinely care about helping people
- Natural English that flows well

Provide:
- Individual scores for each trait (1-10)
- An overall average score
- Detailed feedback (2-3 paragraphs) focusing on their suitability for warm patient communication
- A concise 2-3 sentence summary for quick review

Format your response as JSON:
{
  "clarity_score": <number 1-10>,
  "pacing_score": <number 1-10>,
  "tone_score": <number 1-10>,
  "energy_score": <number 1-10>,
  "confidence_score": <number 1-10>,
  "overall_score": <number 1-10>,
  "detailed_feedback": "<string>",
  "summary": "<string>"
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
          { 
            role: 'system', 
            content: 'You are an expert HR recruiter specializing in healthcare customer service roles. You understand the difference between warm, empathetic patient communication and cold clinical professionalism. Respond only with valid JSON.' 
          },
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

    console.log('Analysis completed with scores:', analysis);

    // Step 3: Save results to database with detailed trait scores
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        voice_transcription: transcription,
        voice_analysis_score: Math.round(analysis.overall_score),
        voice_analysis_feedback: analysis.detailed_feedback,
        voice_clarity_score: Math.round(analysis.clarity_score),
        voice_pacing_score: Math.round(analysis.pacing_score),
        voice_tone_score: Math.round(analysis.tone_score),
        voice_energy_score: Math.round(analysis.energy_score),
        voice_confidence_score: Math.round(analysis.confidence_score),
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
