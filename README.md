This is a fork of [nitawa](https://github.com/nitawa-hl)'s
hatlike tracker for [hanabi competitions](https://hanabi-competitions.com).

## What are hatlike plays?

In games with four or more players, there are so-called
[hat-guessing strategies](https://github.com/hanabi/hanabi.github.io/blob/main/misc/hat-guessing.md)
which are considered game-breaking.
Competitions on hanab.live are often played with the following house rule as a result:

Hence, the following rule is often used.

> In the instant before someone plays a card, they enter a P state,
> which they do not exit until they take a non-play action.
> Let S be the set of cards in a player's hand at the instant they enter P state.
> A play of an unclued card X is *hatlike* if: (a) X is in S; (b) within S, there is a card newer
> than X that is still in hand and has not been clued.
> 
> When a hatlike play occurs, no other hatlike play may occur until after the next clue or discard.

This is designed to prevent hat-guessing,
which has a signature of consecutive blind plays from arbitrary slots,
while minimally impacting other types of conventions.
In particular, hidden or layered finesses are not hatlike.

The following [Hyphen-ated conventions](https://hanabi.github.io)
should mostly be okay, but maybe there will be
situations where they occur subsequently to each other:

* Elimination blind plays
* Trash push
* Blaze discard
* Finesses where the finessed player takes a turn off playing

Additionally, the following moves can violate this ruleset by themselves,
so if they are used, the second play may need to wait a round:

* Positional double misplay not on slot 1
* Shadow finesse

## What does this extension do?

Basically, it yells at you if you make a hatlike play,
so you don't have to keep track of it.

* The extension icon is green when a hat-like play is allowed, else red.
  This works during replays as well.
* If you click on the hat icon, it shows which slots would cause a hatlike play.
* While playing, an air horn sounds if a player makes a hatlike move.
* The extension also draws a small hat under each hatlike slot.

## How do I use it?

[Install as an unpacked chrome extension](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/).

## Credits and notes

Thanks to nitawa for [implementing most of this](https://discord.com/channels/140016142600241152/712422871044980848/837774900169015428)!

Thanks to the hyphen-ated group for running [hanab.live](https://hanab.live)
and the running the hanabi competitions.

The code I introduced is terrible. Bugfixes and pull requests welcome.
