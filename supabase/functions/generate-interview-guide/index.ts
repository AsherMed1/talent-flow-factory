
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are an expert HR professional and interview specialist. Create a comprehensive interview guide based on the provided job description or role details.

Generate 8-12 interview steps that follow a logical interview flow. Each step should have:
- title: A clear, concise title for the step
- content: Detailed instructions, questions, or script content
- type: One of "instruction", "question", "task", or "script"

Structure the interview to include:
1. Introduction and setup
2. Candidate background questions
3. Role-specific technical or behavioral questions
4. Skills assessment or tasks if applicable
5. Company/role overview
6. Requirements verification
7. Closing questions

Return ONLY a valid JSON object with this exact structure:
{
  "steps": [
    {
      "title": "Step title",
      "content": "Detailed content for this step",
      "type": "instruction|question|task|script"
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create an interview guide for this role:\n\n${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid response format from AI');
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating interview guide:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
