import { TIMEOUT_SEC } from './config';
export const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long. Timeout after ${seconds} seconds.`)
      );
    }, 1000 * seconds);
  });
};

export const AJAX = async (url, uploadData) => {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const result = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await result.json();

    if (!result.ok) throw new Error(`${data.message} ${result.status}`);

    return data;
  } catch (err) {}
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     const result = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     const data = await result.json();

//     if (!result.ok) throw new Error(`${data.message} ${result.status}`);

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const sendJSON = async function (url, content) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(content),
//     });

//     const result = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     const data = await result.json();

//     if (!result.ok) throw new Error(`${data.message} ${result.status}`);

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
