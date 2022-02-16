

export const fetchQuery = async (query, url, variables, operationName) =>{
  try {
    const data = await (await fetch(
    url,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "X-Hasura-Role": "user",
      },
      body: JSON.stringify({
        query: query,
        variables: {...variables},
        operationName: operationName
      })
    }
  )).json();
  return data
  }
  catch(err){
    console.info('fetch error', err)
  }
}
// "X-Hasura-Admin-Secret": "cbRN74hcA1wDm0bt53IRC8wcc9AqdDflevGtLzbSEhyVMnlJ81AE7g6UsGtoCb1g"