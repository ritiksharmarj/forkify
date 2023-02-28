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

export const AJAX = async (url, uploadData = undefined) => {
   try {
      const fetchValue = uploadData
         ? fetch(url, {
              method: 'POST',
              headers: {
                 'Content-Type': 'application/json',
              },
              body: JSON.stringify(uploadData),
           })
         : fetch(url);

      const response = await Promise.race([fetchValue, timeout(TIMEOUT_SEC)]);
      const data = await response.json();

      if (!response.ok) throw new Error(`${data.message} (${response.status})`);

      return data;
   } catch (error) {
      throw error;
   }
};

/*
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

export const sendJSON = async (url, uploadData) => {
   try {
      const fetchValue = fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(uploadData),
      });

      const response = await Promise.race([fetchValue, timeout(TIMEOUT_SEC)]);
      const data = await response.json();

      if (!response.ok) throw new Error(`${data.message} (${response.status})`);

      return data;
   } catch (error) {
      throw error;
   }
};
*/
