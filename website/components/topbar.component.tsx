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
        <a href="/powhatan/game">Video Game</a>
        <a href="/powhatan/japan">Japan</a>
        <a href="/powhatan/movie">Movie</a>
        <a href="/powhatan/dictionary">Powhatan Dictionary by William Strachey</a>
        <a href="/powhatan/dictionarysmith">Powhatan Dictionary by Captain John Smith</a>
        <a href="https://livingdictionaries.app/tutelo-saponi/entries">Monacan Dictionary</a>
        <a href="/powhatan/dictionarytupi">Dicionário Tupi Antigo A Língua Indígena Clássica Do Brasil</a>
        <a href="/powhatan/basque">A Basque Etymology for the Amerindian Tribal Name Iroquois</a>
        <a href="/powhatan/mahican">Mahican (Mohegan) Dictionary</a>
        <a href="/powhatan/newjersey">Ancient New Jersey Jargon</a>
        <a href="/powhatan/newjerseydelaware">A Vocabulary of New Jersey Delaware</a>
        <a href="/powhatan/delaware">Denny's Vocabulary of Delaware</a>
        <a href="/powhatan/minsi">Early Fragments of Minsi Delaware</a>
        <a href="/powhatan/unamidelaware">A Vocabulary of the Unami (Delaware) Jargon</a>
        <a href="/powhatan/nanticoke">Heckewelder's Vocabulary of Nanticoke</a>
        <a href="/powhatan/tutelo">The Tutelo Language</a>
        <a href="/powhatan/powhatanjargon">Powhatan, a pure Algonquian Jargon</a>
        <a href="https://encyclopediavirginia.org/primary-documents/the-huskanaw-ritual-an-excerpt-from-the-history-of-virginia-by-robert-beverley-1722/">Huskanaw</a>
        <a href="https://docsouth.unc.edu/southlit/jefferson/jefferson.html">Notes on the State of Virginia (1781)</a>
        <a href="https://docsouth.unc.edu/southlit/smith/smith.html">The Generall Historie of Virginia, New-England, and the Summer Isles(1584 - 1624)</a>
        <a href="https://docsouth.unc.edu/southlit/beverley/beverley.html">The History and Present State of Virginia, In Four Parts. (1673-1722)</a>
        <a href="https://youtube.com/playlist?list=PLBKaXCj9beBAmpS2pGjCzNFO_B6ewckN5&si=q9AwG6cet29hroUo">Mixtape</a>
        <a href="/powhatan/spermdonation">Sperm Donation</a>
      </div>
    );
  }
}

export default Topbar;
