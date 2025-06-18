
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

    // Step 2: Updated analysis prompt with better criteria for native speakers
    const analysisPrompt = `
You are an expert speech analyst specializing in identifying native English speakers for US healthcare roles. You have extensive experience with American, Canadian, British, Australian, and other native English speaking accents and speech patterns.

CRITICAL ASSESSMENT GUIDELINES:

**NATIVE ENGLISH SPEAKER IDENTIFICATION:**
- Focus on natural speech flow, rhythm, and intonation patterns typical of native speakers
- Look for comfortable use of contractions, natural filler words ("um", "like", "you know" when used naturally)
- Assess if stress patterns, syllable emphasis, and sentence rhythm sound native
- Consider regional accents (Southern, Midwest, Boston, etc.) as fully native
- Rate 8-10 for any clearly native speaker, regardless of regional accent
- Rate 6-7 only for very fluent non-native speakers with minimal accent
- Rate 1-5 for obvious non-native accents or unnatural speech patterns

**FRIENDLY & PERSONABLE COMMUNICATION:**
- Value warmth, enthusiasm, and genuine personality in speech
- Recognize that casual, friendly tone is POSITIVE for healthcare patient interaction
- Look for natural conversational style that would put patients at ease
- Don't penalize informal language if it sounds genuine and warm

The candidate's transcription is:
"${transcription}"

Evaluate on these criteria:

1. **English Fluency & Naturalness** (1-10): Does this sound like a native English speaker? Consider natural rhythm, intonation, stress patterns, and comfortable use of language. Regional accents are fully acceptable.

2. **Speech Clarity & Articulation** (1-10): How clearly do they speak? Can patients easily understand them?

3. **Motivation & Enthusiasm** (1-10): Do they sound genuinely interested and motivated? Look for authentic energy and positivity.

4. **Conversational Flow** (1-10): Do they speak naturally and comfortably? Natural speech patterns and casual tone are positive.

5. **Professional Communication** (1-10): Would patients feel comfortable speaking with them? Friendly, warm communication is preferred for healthcare.

6. **Confidence & Composure** (1-10): Do they sound confident and at ease? Natural, comfortable delivery is key.

**SCORING PHILOSOPHY:**
- Native speakers with regional accents should score 8-10 on fluency
- Friendly, casual speech is POSITIVE for patient communication
- Natural conversation style beats overly formal delivery
- Genuine personality and warmth are highly valued
- Only mark down for obvious non-native patterns or poor communication

Provide your assessment as JSON:
{
  "english_fluency_score": <number 1-10>,
  "speech_clarity_score": <number 1-10>,
  "motivation_score": <number 1-10>,
  "conversational_flow_score": <number 1-10>,
  "professional_communication_score": <number 1-10>,
  "confidence_score": <number 1-10>,
  "overall_score": <number 1-10>,
  "accent_assessment": "<assessment of native vs non-native speech patterns>",
  "motivation_assessment": "<assessment of genuine enthusiasm and personality>",
  "recommendation": "<RECOMMEND|MAYBE|REJECT>",
  "detailed_feedback": "<comprehensive feedback focusing on communication strengths and patient interaction suitability>"
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
            content: 'You are an expert speech analyst who specializes in identifying native English speakers and assessing communication skills for healthcare roles. You understand that friendly, casual communication is often better for patient interaction than overly formal speech. You recognize all native English accents including regional American, British, Australian, and Canadian variants as fully native. Respond only with valid JSON.' 
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
