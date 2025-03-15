var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// components/user-item.ts
import { JSX, Component } from "1car.us";
let Topbar = class Topbar extends HTMLElement {
    render() {
        return (JSX("div", { className: "topbar" },
            JSX("a", { href: "/powhatan" }, "Home"),
            JSX("a", { href: "/powhatan/reservation" }, "Reservation"),
            JSX("a", { href: "/powhatan/usa" }, "USA"),
            JSX("a", { href: "/powhatan/game" }, "Video Game"),
            JSX("a", { href: "/powhatan/japan" }, "Japan")));
    }
};
Topbar = __decorate([
    Component({
        tag: "top-bar",
        shadow: true,
        styleUrl: "../components/topbar.css",
    })
], Topbar);
export { Topbar };
export default Topbar;
