import "styled-jsx";
import GiftWrapper from "../components/gift";

export default function GiftPage() {
  return (
    <div className="inline-flex flex-row flex-wrap mt-32 mb-24">
      <GiftWrapper gifterTokenId={0} />
      <GiftWrapper gifterTokenId={1} />
      <GiftWrapper gifterTokenId={2} />

      <GiftWrapper gifteeTokenId={0} />
      <GiftWrapper gifteeTokenId={1} />
      <GiftWrapper gifteeTokenId={2} />
    </div>
  );
}
