This is a hatlike tracker for [hanabi competitions](https://hanabi-competitions.com).

## What are hatlike plays?

In games with four or more players, there are so-called
[hat-guessing strategies](https://github.com/hanabi/hanabi.github.io/blob/main/misc/hat-guessing.md)
which are considered game-breaking.
So the 4p Hanabi competitions have sometimes been played with the following house rule:

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
In particular, hidden or layered finesses do not cause hatlike plays.

The following [H-group conventions](https://hanabi.github.io)
should mostly be okay, but there may be
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
* The hats turn into sirens if blindplaying that slot is forbidden under the rule.
* The extension will also warn you before playing a card that violates the rule
  (much like it warns you when you are about to play a known unplayable card).

## How do I use it?

[Install as an unpacked chrome extension](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/).

## Credits and notes

Thanks to vEnhance for his improvements, at this point most code is his!

Thanks to the H-group for running [hanab.live](https://hanab.live).
Thanks to both the H-group and [Hanabi Central](https://discord.gg/BQKYDWRq) for running the hanabi competitions

It is all terrible code though. Bugfixes and pull requests welcome.
