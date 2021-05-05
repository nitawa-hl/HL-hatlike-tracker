var turn_sound_last_played = -1;

function hat_main(new_activity) {
  const hat_text_normal = "👒";
  const hat_text_danger = "🚨";

  try {
    var is_active = !window.globals.state.finished;
    var Players = Array.from(window.globals.metadata.playerNames);
    var state = (new_activity && is_active)
      ? window.globals.state.ongoingGame
      : window.globals.state.visibleState;
    var Hands = Array.from(state.hands);
    var Log = Array.from(state.log);
    var Clues = Array.from(state.clues);
    if (!is_active) {
      turn_sound_last_played = -1;
    }
  }
  catch (TypeError) {
    console.warn("Still waiting on a play");
    return;
  }

  var clued_cards = [];
  for (let i=0; i<Clues.length; i++) {
    clued_cards = clued_cards.concat(Clues[i].list);
  }

  var S = {};
  var numPlayers = Players.length
  if (numPlayers == 2 || numPlayers == 3) {
    var numCards = 5;
  } else if (numPlayers == 4 || numPlayers == 5) {
    var numCards = 4;
  } else {
    var numCards = 3;
  }

  for (player of Players)  {
    S[player] = {start:-1, Sset:null};
  };

  // For each player, we locate the most recent turn they played
  // if Alice played most recently on turn 7,
  // e.g. S["alice"].start = 7
  // and we then let S["alice"].Sset = [N,N,N...,N]
  // where N is the current turn count
  var latestClue = 0
  for (let P = 0; P < numPlayers; P++) {
    found = false;
    for (let turn = Log.length - 1 - P; turn > 0 && !found; turn -= numPlayers) {
      var entry = Log[turn].text;
      var EntryList = entry.split(" ");
      if (EntryList[1] == "plays" || EntryList[1] == "fails") {
        S[EntryList[0]].start = turn;
        S[EntryList[0]].Sset = Array(numCards).fill(Log.length);
      } else {
        latestClue = Math.max(latestClue, turn);
        found = true;
      }
      Log[turn] = EntryList;
    }
  }

  var latestHLP = -1
  for (player of Players) {
    var playerIndex = Players.indexOf(player);
    var played = 0;
    if (S[player].start > latestHLP) {
      latestHLP = -1;
    }

    if (S[player].Sset) {
      for (let turn = S[player].start; turn < Log.length && S[player].Sset; turn += numPlayers) {
        var EntryList = Log[turn];
        var P = EntryList[0];
        if (P != player) {
          console.error("Extension error");
        }
        var idxslot = EntryList.indexOf('slot')
        var slot = EntryList[idxslot + 1][1];

        var Sslot = slot - played - 1;
        if (Sslot > -1) { // played card is in S
          var index = -1;
          for (let k = 0; k <= Sslot; k++) { // find the Sslot-th card in S that hasn't been played yet.
            index = S[player].Sset.indexOf(Log.length, index+1);
          }
          played++;
          if ( EntryList.length > idxslot + 1 && EntryList[idxslot + 2] == "(blind)") { // played blind
            S[player].Sset[index] = turn; // we save the turn of the blindplay to check if it was hat-like later
          } else {
            S[player].Sset[index] = 0; // it was clued, so we don't care
          }
        }
      }
      // Now we have the Sset updated. Those with entry = currentTurn are not played.
      // We check now which are clued, and set them to 0
      // Note that we don't care if a card to the left of a blindplay was unclued at the time of the blindplay, because
      // the clue that clued the card later would have reset the Qstate to false anyway.
      var minTurn = null;
      S[player].HLslots = []
      var LTRslot = 0;
      for (let i = numCards - 1; i >= 0; i--) {
        if (S[player].Sset[i] == Log.length) { // card is still on the hand of the player
          if (clued_cards.includes(Hands[playerIndex][LTRslot])) {
            S[player].Sset[i] = -1;
          } else {
            S[player].HLslots.unshift(numCards - LTRslot);
          }
          LTRslot++;
        }
        if (minTurn == null) {
          minTurn = S[player].Sset[i];
        }
        if (S[player].Sset[i] > minTurn) {
          if (minTurn > latestHLP) {
            latestHLP = minTurn;
          }
          minTurn = S[player].Sset[i];
        } else if (S[player].Sset[i] > latestClue) {
          minTurn = S[player].Sset[i]
        }
      }
      S[player].Sstart = numCards - S[player].Sset.filter(x => (x === Log.length || x === -1)).length + 1;
      S[player].HLslots.shift(); // Blindplaying the leftmost unclued card in S is not a hat-like play
    } else {
      S[player].Sstart = 1;
      S[player].HLslots = []
      for (let i = 0; i < numCards; i++) {
          if (!clued_cards.includes(Hands[playerIndex][i])) {
              S[player].HLslots.unshift(numCards - i);
          }
      }
      S[player].HLslots.shift();
    }
  }

  // Edge case: if player has no more turns left, quit early
  for (player of Players) {
    var playerIndex = Players.indexOf(player);
    if (state.hands[playerIndex].length < numCards) {
      S[player].HLslots = [];
    }
  }

  // Prepare message to emit to content.js
  msg = "";
  tbl = [];
  for (player of Players) {
      msg += player + ": " + S[player].start + ", " + S[player].Sstart + "\n";
      tbl.push([player, S[player].start, S[player].Sstart, S[player].HLslots]);
  }
  var Q = (latestHLP > latestClue);
  tbl.push(Q);
  msg += "Qstate: " + Q
  // Also add on the turn of the current state
  tbl.push(state.turn.turnNum + 1);


  // Decide whether to play the air horn
  var ongoing_current_turn = window.globals.state.ongoingGame.turn.turnNum;
  var notify = (
    (latestHLP == ongoing_current_turn)
    && (turn_sound_last_played != ongoing_current_turn)
    && is_active
  );
  if (notify) {
    turn_sound_last_played = ongoing_current_turn;
  }

  // Decide whether to update icons and so on
  var update = (state === window.globals.state.visibleState);
  // Draw hats
  if (update) {
    for (player of Players) {
      var playerIndex = Players.indexOf(player);
      let hand = window.globals.elements.playerHands[playerIndex].children;
      for (var i=0; i<hand.length; i++) {
        let hatlike = S[player].HLslots.includes(i+1);
        let card = hand[hand.length - 1 - i].card;
        if (!card.hat) {
          card.hat = new Konva.Text({
            x:10,
            y:card.height()+5,
            text:hat_text_normal,
            fontSize: 30,
            visible: false}
          );
          card.add(card.hat);
          card.parent.checkMisplay = (function() {
            const old_function = card.parent.checkMisplay;
            return function() {
              let ret = old_function.apply(this, arguments);
              if (ret) {
                return true;
              }
              else if (globals.options.speedrun) {
                return true;
              }
              else if (this.card.hat.isVisible() && this.card.hat.getText() === hat_text_danger) {
                let text = "Are you sure you want to play this?\n";
                text += "This breaks the house rule on hatlike plays.";
                return !window.confirm(text);
              }
              return false;
            }
          })();
        }
        if (hatlike) {
          card.hat.text(Q ? hat_text_danger : hat_text_normal);
          card.hat.show();
          card.parent.getLayer().draw();
        }
        if (!hatlike && card.hat.isVisible()) {
          card.hat.hide();
          card.parent.getLayer().draw();
        }
      }
    }
  }
  for (card_info of window.globals.state.visibleState.deck) {
    if (typeof card_info.location !== "number") {
      const card = window.globals.deck[card_info.order];
      if (card.hat && card.hat.isVisible()) {
        card.hat.hide();
        card.parent.getLayer().draw();
      }
    }
  }

  // Post message to window
  window.postMessage({
      type: "FROM_PAGE",
      text: msg,
      Qstate: Q,
      data: tbl,
      notify: notify,
      latestHLP: latestHLP,
      update: update,
  }, "*");
}

