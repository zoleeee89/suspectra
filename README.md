# Suspectra

Murder logic puzzles for Android and iOS: place every suspect and the victim on the floor plan, one per row and column, and unmask the only suspect who was alone with the victim.

- .NET 10 MAUI shell with a HybridWebView; the whole game is in `Resources/Raw/wwwroot`.
- Cases are generated on the phone from a seed, so everyone gets the same daily case.
- Every case has exactly one solution and can be solved without guessing (`deduce()` in `js/rules.js`).

Run the generator tests:

```
node tests/rules.test.js 60
```

Try the game in a browser:

```
cd Resources/Raw/wwwroot && python3 -m http.server 8000
```

See `HANDOFF.yml` for the current state and next steps.
