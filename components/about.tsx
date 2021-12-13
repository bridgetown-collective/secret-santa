export default function About() {
  return (
    <div className="about">
      <div className="text-2xl">
        <table>
          <tr>
            <td className="pr-5">🎅</td>
            <td>Mint a Raging Santa by Giving an NFT to the Gift Swap!</td>
          </tr>
          <tr>
            <td>🎁</td>
            <td>Claim a Random Gift from the Swap!</td>
          </tr>
          <tr>
            <td>🎄</td>
            <td>Share Your Good Tidings With NFT Friends!</td>
          </tr>
        </table>
      </div>
      <style jsx global>{`
        .about {
          font-weight:400;
        }
      `}</style>
    </div>
  );
}
