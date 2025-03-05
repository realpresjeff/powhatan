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
      </div>
    );
  }
}

export default Topbar;
