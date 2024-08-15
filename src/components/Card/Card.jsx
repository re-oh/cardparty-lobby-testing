import "./card.scss";

const Card = (props) => {
  const { setCardText, cardText } = props;

  return (
    <div className="Card">
      <textarea
        name="text"
        id="text"
        rows="20"
        cols="22"
        value={cardText}
        onChange={(e) => {
          setCardText(e.target.value);
        }}
      ></textarea>
    </div>
  );
};

export default Card;
