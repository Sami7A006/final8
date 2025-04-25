import { createClient } from 'npm:@supabase/supabase-js';
import * as cheerio from 'npm:cheerio';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { headers: jsonHeaders, status: 400 }
      );
    }

    const ewgUrl = `https://www.ewg.org/skindeep/search/?search=${encodeURIComponent(query)}`;
    const response = await fetch(ewgUrl);
    
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch from EWG website' }),
        { headers: jsonHeaders, status: 502 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Updated selectors to match new EWG website structure
    const firstProduct = $('.product-listing').first();
    
    if (!firstProduct.length) {
      return new Response(
        JSON.stringify({ error: 'No product found' }),
        { headers: jsonHeaders, status: 404 }
      );
    }

    const productName = firstProduct.find('h2.product-title').text().trim();
    const brand = firstProduct.find('.product-brand').text().trim();
    const scoreText = firstProduct.find('.product-hazard-score').text().trim();
    const score = parseInt(scoreText) || null;
    const category = firstProduct.find('.product-type').text().trim();
    
    // Get ingredients from the product details section
    const ingredients = firstProduct.find('.product-ingredients-list li')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    // Get concerns from hazard section
    const concerns = firstProduct.find('.product-hazards li')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    const product = {
      name: productName,
      brand,
      score,
      category,
      ingredients: ingredients.length ? ingredients : [],
      concerns: concerns.length ? concerns : [],
    };

    // Validate that we have at least the basic product information
    if (!product.name) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse product data' }),
        { headers: jsonHeaders, status: 500 }
      );
    }

    return new Response(
      JSON.stringify(product),
      { headers: jsonHeaders }
    );
  } catch (error) {
    console.error('Error in EWG search:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process product data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: jsonHeaders, status: 500 }
    );
  }
});