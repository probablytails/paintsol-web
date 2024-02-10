/* eslint-disable quotes */

export const CurationInfoText = () => {
  return (
    <>
      <p>{`These paintings do not have an artist assigned to them. If you know the artist for a painting, please let us know in our Telegram!`}</p>
      <p>{`We'd also appreciate help adding missing tags. Some important tags include:`}</p>
      <ul>
        <li>{`token = painting for a token other than $paint`}</li>
        <li>{`pfp = painting of someone's pfp`}</li>
        <li>{`for nft collections, the name of the nft collection should be tagged`}</li>
      </ul>
    </>
  )
}
