# Globoplay Subtitles

This assumes you're using Google Chrome.

1. Go to [Globoplay](https://globoplay.globo.com/) and navigate to the show you want to watch.
2. Turn on Portuguese subtitles.

Find the subtitles (WebVTT) file:
3. Open View menu > Developer > Developer Tools.
4. Reload the page.
5. Choose the "Network" tab. Filter for "`.vtt`"
6. Double-click the VTT file. The filename should look like "1877344-por-08478770-5ec8-013b-bb3b-1afe9761092a.vtt".
7. The file will open in a new tab. Chrome will offer to translate. Ignore, because the text encoding is wrong.

Translate the subtitles:
8. Save the VTT file. Close the tab.
9. Open the saved file in Chrome. (This is to workaround the wrong text encoding.)
10. Chrome will offer to translate. Accept, and save the translated VTT file.
11. Close the Developer Tools pane.

Convert the subtitles:
12. Use a tool like https://subtitletools.com/convert-to-srt-online to convert the VTT file to SRT file.

Install browser extension:
13. Click the "…" menu in the upper-right, choose Extensions > Visit Chrome Web Store.
14. Search for "Movie Subtitles". Click "Add to Chrome" to install it.
15. Go back to the Globoplay tab.
16. (optional) Right-click the "Movie Subtitles" extension and change "This Can Read and Change Site Data" to "On globoplay.globo.com".
17. Reload the tab.
18. Click the "Movie Subtitles" extension.
19. Load the translated SRT file. Enjoy!



---

1. Follow the steps above to grab the VTT file.
1. Run e.g. `python3 main.py avenida-brasil/1875660-por-0717d7b0-5ec8-013b-bb32-1afe9761092a.vtt`
1. Open the joined file `avenida-brasil/1875660-por-0717d7b0-5ec8-013b-bb32-1afe9761092a_joined.vtt` in Chrome. Translate to English.
1. Save the translated file as `avenida-brasil/1875660-por-0717d7b0-5ec8-013b-bb32-1afe9761092a_joined_en.vtt`.
1. Use https://subtitletools.com/convert-to-srt-online to convert to SRT format. Save as e.g. `Avenida_Brasil_1875660_E1_2012-03-26_en.srt`.
