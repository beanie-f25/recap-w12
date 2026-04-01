"use client"

import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from "react";
const supabaseUrl = 'https://grhlclpfdgqsixevykvi.supabase.co'
const supabaseKey = "sb_publishable_FoVHWDxUQTSYbp1WLcO6bg_YjLnj8mc";
const supabase = createClient(supabaseUrl, supabaseKey)

import {GoogleGenAI} from '@google/genai';
const GEMINI_API_KEY = "AIzaSyBS-V-5S1IV3RnTNQhIM7Wkxa8CEoEMx5o";
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export default function Home() {

  const [data, setData] = useState<unknown[]>([]);



  const fetchData = async () => {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      setData(messages || []);

  }

  useEffect(() => { // eslint-disable-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const ask = async () => {

    const response = prompt("What message do you want to leave behind?");

    const response_gemini = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: 'You are a digital version of RM of BTS, a Korean boy band member. Please write a short response to the following message, less than 10 words: ' + response,
    });

    const { data, error } = await supabase
      .from('messages')
      .insert([
        { message: response, response: response_gemini.text },
      ])
      .select()    
      fetchData();

  }



  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      <button className='bg-black text-white p-2 mb-3' onClick={ask}>
        Add new
      </button>

      <table className="">
        <thead>
          <tr>
            <th className="p-2 text-start">ID</th>
            <th className="p-2 text-start">Message</th>
            <th className="p-2 text-start">Response</th>
          </tr>
        </thead>
        <tbody>
        {data.map((item: any) => (
          <tr key={item.id}>
            <td className="p-2">{item.id}</td>
            <td className="p-2">{item.message}</td>
            <td className="p-2">{item.response}</td>
          </tr>
        ))}
        </tbody>

      </table>

    </div>
  );
}
