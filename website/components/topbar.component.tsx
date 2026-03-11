// components/user-item.ts
import { JSX, Component } from "1car.us";

@Component({
  tag: "top-bar",
  shadow: true,
  styleUrl: "../components/topbar.css",
})
export class Topbar extends HTMLElement {
  render() {
    return (
      <div className="topbar">
        <a href="/powhatan">Home</a>
        <a href="/powhatan/reservation">Reservation</a>
        <a href="/powhatan/usa">USA</a>
        <a href="/powhatan/game">Video Game</a>
        <a href="/powhatan/japan">Japan</a>
        <a href="/powhatan/movie">Movie</a>
        <a href="/powhatan/dictionary">Powhatan Dictionary by William Strachey</a>
        <a href="/powhatan/dictionarysmith">Powhatan Dictionary by Captain John Smith</a>
        <a href="/powhatan/dictionarytupi">Dicionário Tupi Antigo A Língua Indígena Clássica Do Brasil</a>
        <a href="/powhatan/frenchtopowhatan">French to Powhatan (Incomplete)</a>
        <a href="https://youtube.com/playlist?list=PLBKaXCj9beBAmpS2pGjCzNFO_B6ewckN5&si=q9AwG6cet29hroUo">Mixtape</a>
      </div>
    );
  }
}

export default Topbar;
