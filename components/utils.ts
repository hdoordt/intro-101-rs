export const fetchWithTimeout = (url, options, timeout = 6000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]) as Promise<Response>;
}

export const fetchAvailableCrates = () =>
  fetchWithTimeout('https://play.rust-lang.org/meta/crates', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
  })
  .then(response => response.json())
  .then(response => response.crates.map(item => item['id']));

export const allCratesAvailable = (code: string, playgroundCrates: string[]) => {
  // get list of `extern crate`'s from snippet
  const re = /extern\s+crate\s+([a-zA-Z_0-9]+)\s*;/g;
  const externCrates: string[] = [];
  while (true) {
    const res = re.exec(code);
    if (!res) {
      break;
    }

    externCrates.push(res[1]);
  }

  return externCrates.every((item) => playgroundCrates.includes(item));
}
