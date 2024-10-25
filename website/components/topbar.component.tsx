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
        <a href="/reservation">Reservation</a>
        <a href="/usa">USA</a>
        <a href="/game">Video Game</a>
      </div>
    );
  }
}

export default Topbar;
