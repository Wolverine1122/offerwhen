import BulletList from "../../components/BulletList/BulletList";
import "./discord-bot.css";

const DiscordBot = () => {
  return (
    <div className="discord-bot">
      <h1>Discord Bot</h1>
      <p>We plan on making a discord bot that you can add to a server.</p>
      <p>You will be able to check company stats such as:</p>
      <BulletList
        items={[
          "number of entries",
          "lowest score for OA",
          "median score for technical interview",
          "where your score stands compared to others",
        ]}
      />
      <p>and more...</p>
      <p>Once we have enough data, it will sense to implement it</p>
    </div>
  );
};

export default DiscordBot;
