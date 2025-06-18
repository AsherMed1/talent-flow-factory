
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

    console.log('Processing enhanced voice analysis for application:', applicationId);

    let audioBlob: Blob;

    // Check if audioData is a URL or base64 data
    if (typeof audioData === 'string' && (audioData.startsWith('http') || audioData.startsWith('https'))) {
      console.log('Fetching audio from URL:', audioData);
      const audioResponse = await fetch(audioData);
      if (!audioResponse.ok) {
        throw new Error(`Failed to fetch audio file: ${audioResponse.statusText}`);
      }
      audioBlob = await audioResponse.blob();
    } else {
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

    // Step 2: Enhanced analysis with focus on naturalness and motivation
    const analysisPrompt = `
You are an expert recruiter evaluating voice recordings for US-based healthcare appointment setters. Your goal is to identify candidates who sound like native English speakers and are genuinely motivated for the role.

CRITICAL REQUIREMENTS:
- Must sound like they could be from the US (no detectable foreign accent)
- Natural, conversational English that flows smoothly
- Genuine enthusiasm and motivation (not scripted or robotic)
- Professional but warm communication style suitable for healthcare

The candidate's voice recording transcription is:
"${transcription}"

Evaluate them on these enhanced criteria:

1. **English Fluency & Naturalness** (1-10): Do they sound like a native English speaker? Is their speech natural and conversational without foreign accent markers? Rate 1-3 for obvious non-native accents, 4-6 for slight accents, 7-8 for very good fluency, 9-10 for native-level naturalness.

2. **Speech Clarity & Articulation** (1-10): How clearly do they speak? Are words properly pronounced? Can you understand them easily without strain?

3. **Motivation & Enthusiasm** (1-10): Do they sound genuinely excited about the opportunity? Is there authentic energy in their voice, or do they sound disinterested/going through the motions?

4. **Conversational Flow** (1-10): Do they speak naturally like in normal conversation? Avoid robotic, scripted delivery. Look for natural pauses, inflection, and rhythm.

5. **Professional Communication** (1-10): Do they maintain appropriate professionalism while still sounding personable? Would clients feel comfortable speaking with them?

6. **Confidence & Composure** (1-10): Do they sound confident without being arrogant? Minimal hesitation, filler words, or nervous energy?

SCORING GUIDELINES:
- Candidates with detectable foreign accents should score 4 or below on English Fluency
- Lack of genuine enthusiasm should result in low Motivation scores
- Robotic or heavily scripted delivery should score poorly on Conversational Flow
- Only candidates scoring 7+ on English Fluency should be considered for US healthcare roles

Provide:
- Individual scores for each trait (1-10)
- An overall average score
- A brief assessment of accent/origin (if detectable)
- Specific feedback on motivation level
- Clear recommendation: RECOMMEND, MAYBE, or REJECT

Format your response as JSON:
{
  "english_fluency_score": <number 1-10>,
  "speech_clarity_score": <number 1-10>,
  "motivation_score": <number 1-10>,
  "conversational_flow_score": <number 1-10>,
  "professional_communication_score": <number 1-10>,
  "confidence_score": <number 1-10>,
  "overall_score": <number 1-10>,
  "accent_assessment": "<brief assessment of accent/naturalness>",
  "motivation_assessment": "<assessment of genuine enthusiasm>",
  "recommendation": "<RECOMMEND|MAYBE|REJECT>",
  "detailed_feedback": "<comprehensive feedback focusing on fit for US healthcare role>"
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
            content: 'You are an expert HR recruiter specializing in identifying native English speakers and motivated candidates for US healthcare roles. You have extensive experience detecting accents and assessing genuine motivation. Respond only with valid JSON.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.2,
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

    console.log('Enhanced analysis completed:', analysis);

    // Step 3: Save results to database with enhanced scoring
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        voice_transcription: transcription,
        voice_analysis_score: Math.round(analysis.overall_score),
        voice_analysis_feedback: analysis.detailed_feedback,
        voice_clarity_score: Math.round(analysis.speech_clarity_score),
        voice_pacing_score: Math.round(analysis.conversational_flow_score),
        voice_tone_score: Math.round(analysis.professional_communication_score),
        voice_energy_score: Math.round(analysis.motivation_score),
        voice_confidence_score: Math.round(analysis.confidence_score),
        voice_analysis_completed_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to save analysis: ${updateError.message}`);
    }

    console.log('Enhanced voice analysis completed and saved for application:', applicationId);

    return new Response(
      JSON.stringify({
        success: true,
        transcription,
        analysis,
        recommendation: analysis.recommendation,
        accent_assessment: analysis.accent_assessment,
        motivation_assessment: analysis.motivation_assessment,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in enhanced analyze-voice function:', error);
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
