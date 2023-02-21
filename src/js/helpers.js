import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = (sec) => {
   return new Promise((_, reject) => {
      setTimeout(() => {
         reject(
            new Error(`Request took too long! Timeout after ${sec} second`)
         );
      }, sec * 1000);
   });
};

export const getJSON = async (url) => {
   try {
      const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
      const data = await response.json();

      if (!response.ok) throw new Error(`${data.message} (${response.status})`);

      return data;
   } catch (error) {
      throw error;
   }
};
