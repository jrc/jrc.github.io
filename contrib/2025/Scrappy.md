March 2025

### Web development sucks

A while ago, my son, who was 10 at the time, started telling me about a "click test", something gamers use to measure how fast one can click a mouse button. I had never heard of it before, but a quick web search shows that there are many "click test" websites that feature a big button surrounded by a bunch of ads. The goal is to click as fast as possible during, say, 5 seconds. Then it says something like "You got a CPS of 7.3!! You are a Cheetah!!"

I looked at this, and my programmer brain thought "That's not hard! We could make that ourselves! It's just a button that increments a counter, with a timer and a little math and some conditionals." I figured it would be a good opportunity for my son and me to do a little programming together. He had used e.g. [LightBot](https://lightbot.com/), LEGO Mindstorms (based on [Scratch](https://scratch.mit.edu/)), and CodeCombat before, so he was familiar with some programming concepts, but he hadn't made a webpage before. Long story short, we had to install VS Code (TextEdit wasn't up to the task) and started doing a crash course in HTML, CSS, and JavaScript. I had to look up how to center a button in CSS myself.

Hours later, we got something working locally, and immediately he wanted to be able to share it with friends. Then we got bogged down with web hosting and domain names. He lost interest. (In hindsight, we should have started with e.g. JSFiddle to solve problems with text editing and web hosting, but that doesn't solve the fundamental complexity of HTML + CSS + JavaScript.)

The whole experience reminded me why I actively avoided front-end web development for so long in my professional career. The web was never originally designed for software development. Today, just to do simple things, you need to learn 3 different technologies, with 3 different mental models. Even the syntaxes are different:

- HTML: `<my-element foo-bar="42" />`
- CSS: `.my-class { foo-bar: 42; }`
- JavaScript: `myObject = { fooBar: 42 };`

Oh, and one more:

- JSON: `"myObject": { "fooBar": 42 }`

### The spirit of HyperCard

Fast forward a year. I participated in [Antler](https://www.antler.co/), a VC-backed startup incubator program. met There I met [Pontus](https://pontus.granstrom.me/), and we bonded over some common interests, including [the design of recipes](https://pontus.granstrom.me/blog/redesigning-the-recipe/) and a shared frustration over modern-day programming.

During our many discussions, my mind kept going back to [HyperCard](https://arstechnica.com/gadgets/2019/05/25-years-of-hypercard-the-missing-link-to-the-web/), Apple's interactive media authoring software introduced in 1987. I was 10 at the time myself, and I learned to program in part by inspecting and tweaking other people's HyperCard stacks — often simply to inject my name or add funny sounds.

The beauty of HyperCard is that it didn't feel like a programming environment at all. It looked and felt like a drawing application, with familiar tools like the pencil, eraser, and lasso. But you could also add buttons and text fields, allowing you to add elements of interactivity and programmability. HyperCard's creator, Bill Atkinson, described it as "a software erector set that lets non-programmers put together interactive information".

But HyperCard was never designed for the Internet. It was built for a single user in front of a single Macintosh computer. I started trying to imagine what something "in the spirit of HyperCard" would look like in 2025.

### Teaming up with Pontus

Together, Pontus and I got excited over a few shared beliefs and goals:

- We wanted to explore a wider view of programming, **beyond the form of writing code in text files**. That feels outdated, even inhumane. At the same time, visual programming, [typically](https://drossbucket.com/2021/06/30/hacker-news-folk-wisdom-on-visual-programming/) in the form of blocks or nodes-and-wires, [doesn't scale well](https://interjectedfuture.com/visual-programming-is-stuck-on-the-form/). We both believed that logical ideas are still best expressed in the form of code, but we wanted to reduce the amount of coding necessary. Alan Kay put it best: "[simple things should be easy; complex things should be possible](https://www.quora.com/What-is-the-story-behind-Alan-Kay-s-adage-Simple-things-should-be-simple-complex-things-should-be-possible)."
- Like HyperCard, and like spreadsheets, we wanted to tie together editing/designing, running/using, and sharing/publishing, all of which are fully separate modalities in conventional programming. We wanted to have a **single, unified, "live" environment**, like Google Docs, like Notion, like Figma.
- Again, like HyperCard and spreadsheets, we wanted to **privilege data over code**. Here we were also motivated by [Bret Victor](https://worrydream.com/)'s work, including Pontus' own visit to Dynamicland in California. Their first research prototype was actually called ["HyperCard in the World"](https://dynamicland.org/2016/Hypercard_in_the_World/), with the idea of starting with real-world media, and then adding computation.
  We wanted there to be a similar feeling of data tangibly existing in the world, the only difference being that our world would be a virtual 2D infinite canvas. The implication is that data should be visual and persistent, so that it feels natural to humans. The user-programmer should not have to think about storing and retrieving data from some invisible world inside the computer. "Show the data!" was Pontus' mantra.
- We wanted to **make something useful** for people in the real-world — not a research project where building software is not the end goal, and not a constrained "toy" environment. This implied certain things like embracing the ubiquitous web browser and web technologies, thinking about "bridges" to interoperate with data and services in the world, and leaving "escape hatches" to allow access to functionality that we don't natively support.
- We didn't want to invent a new programming language. We believed that many usability problems in programming are due to weaknesses in the [programming system](https://tomasp.net/techdims/) or in the programming libraries and frameworks, rather than in the language itself. The world already has plenty of programming languages, and inventing a new language would have a significant cost, not only in implementing and maintaining the language and toolchain, but also in onboarding and supporting every single user.
  For all its warts, JavaScript is unquestionably the _lingua franca_ of the web. If you have a JavaScript question, there's plenty of people (and LLMs) you can ask, plenty of books and videos you can find, plenty of courses you can take. Plus, with our goal is to reduce the amount of coding necessary, you should only need to know the core parts of the JavaScript language to get things done. So, pragmatically, we chose to use JavaScript for now.
- We wanted to make something that's "**sustainable**" in the sense of being long-lasting and [durable](https://obsidian.md/about). Whatever you make using our tool today should still be usable months or years later, without you having to pay for subscriptions and deal with software updates. I wanted to make software as an old-fashioned product, not as a service.

We did decide to focus on the niche variously known as "[end-user programming](https://web.media.mit.edu/~lieber/Publications/End-User-Software-Engineering.pdf)", "[small computing](https://hackernoon.com/big-and-small-computing-73dc49901b9a)", ["casual programming"](https://dubroy.com/blog/casual-programming/), "[home-cooked software](https://maggieappleton.com/home-cooked-software)", "[personal software](https://x.com/davidhoang/status/1802140453292372272)", and “[software for one](https://www.nytimes.com/2025/02/27/technology/personaltech/vibecoding-ai-software-programming.html)”. This is in contrast to typical software development frameworks and "no-code" development platforms which cater to professionals working on industrial-strength apps and websites. Another way of putting it is that we wanted to target that gap between going shopping for apps and having to hire someone to build bespoke solutions — or becoming a skilled programmer yourself.

Pontus came up with the project name "Scrappy" and the tagline of enabling people to “make small, scrappy, useful apps just for you and your friends”. Compared to "apps" which are produced somewhere else by someone else, often a for-profit corporation, "scrapps" are…

- personal: You make them for yourself or friends and family, for non-commercial purposes.
- modest: They do what you need; nothing more, nothing less.
- [local](https://www.inkandswitch.com/local-first/): You keep everything locally. No accounts or subscriptions required.
- [malleable](https://malleable.systems/): You can tweak them to better fit your needs over time.
- remixable: You can share them with others as well as learn and borrow from others.

### Concrete use cases

This time, rather than starting by identifying a business problem and then building a technical solution for it, like we did in Antler, we wanted to keep things open-ended. Computers are fundamentally general-purpose machines, after all. I felt like there are enough purpose-built apps and websites in the world already, and we didn't get excited over building another SaaS.

Honestly, it wasn't really clear to us where we were going with this project. We just knew that we were no longer being pushed to start a billion-dollar company. And that was kind of refreshing.

But even though we set out to build a Swiss Army knife product as opposed to a specialized tool, we still found it useful to think about concrete use cases. We compiled a list of a few dozen use cases and grouped them into a handful of clusters:

| Cluster           | Example Use Cases                                                                                                                                                          | Established Solutions             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Action-Based      | Click Test, Car Counter, Attendee Counter, Meme Soundboard, Fart App, Word Game, Typing Tutor, Math Tutor                                                                  | custom apps                       |
| Custom Clock      | Pomodoro Timer, Meeting Cost Clock, Dementia Day Clock                                                                                                                     | custom apps                       |
| Custom Calculator | Pickle/Bread/Beer/Sushi Calculator, Branding Calculator, Kid Chores/Allowance Calculator                                                                                   | Excel, Jotform                    |
| Multi-User Canvas | Cabin Booking Schedule, Weekly Cleaning Schedule, Beer Planner, Party Seating Arrangement, Meeting Agenda, Group Travel Planner, Virtual Game Board, Family Bulletin Board | Miro, Notion, Doodle              |
| Database/Forms    | Grade Computer, Hourly Worker Clock In/Out, Consulting Time Tracker, Community Member Directory, Flashcards, Landing Page with Form                                        | Excel, Notion, Google Forms, Anki |
| Data Workflow     | Local Event Tracker                                                                                                                                                        | Shortcuts, Zapier                 |

Some use cases, like Kahoot-like multi-user quiz, spanned multiple of the above clusters.

### Prototyping

We set off using the open-source [tldraw SDK](https://tldraw.dev/) as a starting point, since it provided an infinite canvas editor with copy/paste, a persistent local data store with undo/redo, real-time multi-user sync, and data attachments, among many other features, all for free. It took some effort to get started, in part because neither of us were proficient in React nor TypeScript.

We took inspiration from HyperCard and spreadsheets, both of which are commonly held up as gold standards of end-user programming:

- **Data handling**: In traditional programming, you use variables to hold data in memory, and you need to think of a programmatic name for each one. Then you need to present that data on the screen somehow, and also deal with storing that data to a file or a database. All of that takes explicit code. In contrast, spreadsheets (and HyperCard, to some extent) unify the concepts of variables in memory, visual objects on the screen, and serialized data in persistent storage. We chose to adopt this approach as well.

  Concretely, in our system when you create a data input field on the canvas, it looks and works just like a cell of a spreadsheet. You can click to edit it, and changes are saved automatically. But unlike in spreadsheets, where cells are visually locked into a grid, we let you place fields freely on the infinite canvas. And unlike in spreadsheets, where all cells have unchangeable, grid-based names like `A1` and `J42`, fields are automatically given dummy names like `fred`, which you can always change to be more intelligible, like `lastName` and `age`.

  We call these visual, persistent data building blocks "Things" ("objects" and "components" already mean other things in programming).

- **Data types**: In typical programming languages, variables have a certain data type, like text or number or date. In contrast, in both HyperCard and spreadsheets, the notion of data types is more watered-down so that often you don't have to think about it. In HyperCard, you only store text, but HyperCard will automatically try to treat text as numbers if you're doing math. In spreadsheets, the data type is "automatic" by default, so "A" is seen as text and "1" is seen as a number. Of course this makes things are easier to use, but if you're not careful, it's also easier to run into unexpected mistakes, including [silent data corruption](https://www.theverge.com/2020/8/6/21355674/human-genes-rename-microsoft-excel-misreading-dates).

  To avoid this problem, we decided to have different kind of Things for different kind of data types. So you choose a text field, number field, a date field, or a boolean checkbox, depending on the type of data that you want to store.

- **Data flow**: The way you use code to change data is actually very different between HyperCard and spreadsheets. In HyperCard, if you want to add 1 to a number, you imperatively say `add 1 to x`. That code is only run at certain points in time, like when the user clicks a button. In spreadsheets, you can't write code like that; rather, you define another cell's value to be `=A1+1`. The spreadsheet then reacts as necessary to keep that relation true. Another way of saying this is that in HyperCard (and traditional programming environments), you actively "push" data; in spreadsheets, you passively "pull" data.

  We decided to experiment with supporting both approaches, where object properties can be either set to static values or "pulled" from evaluating expressions (formulae), but you can also "push" values from imperative code.

We got to the point where we could demonstrate a number of custom Things in our tldraw-based prototype. One could for example, make a Click Test in a matter of minutes, not hours or days! For example, you can drop a button and a number field onto the canvas and write a tiny bit of code like `countField.value++`, and you've already got a button that increments a number! Try that with Excel, Figma, Notion, or HTML/CSS/JavaScript!

However, the underlying implementation of the prototype felt contorted, because tldraw was designed for working with static shape data. More significantly, it became clear that customizing the user interface beyond a certain point would require fully re-writing major components.

### Conferences

Around this time, Pontus and I both traveled to Berlin to attend the [Causal Islands conference](https://causalislands.com/), a small, indie gathering of folks who share an interest in "challenging ideas about what software is, how it's produced, and how it could be different". The talks ranged from technical topics like email encryption to more sociopolitical and artistic topics like decentralized systems and computational poetry. I had followed a number of the presenters and attendees on ~~Twitter~~ Bluesky, and it was fun to meet them in person. The conference gave us the feeling that there are at least a few other crazies in the world who believe in a broader view of programming.

A few weeks later, ACM SIGPLAN (Special Interest Group on Programming Languages) held its SPLASH conference in California. We didn't attend, but there was a very relevant [keynote talk by Jonathan Edwards](https://www.youtube.com/live/4GOeYylCMJI?si=yXrIRLY7L94Q_QMY&t=2286) . He talked about "substrates", namely Smalltalk, Lisp, and (yes!) HyperCard, in contrast to the tall "stack" of software layers used in typical modern-day software engineering projects. Surprisingly, he outlined some of the same exact design goals as our little project, the one that we started months earlier: keeping data persistent, being able to manipulate data and code graphically, unifying the concepts of "programming = using". Needless to say, we started saying "substrate" a lot more.

### Rewriting the prototype

Faced with the prospect of continuing with our tldraw-based prototype, I started getting the itch to start over from scratch. How hard could it be to write a infinite canvas editor completely from the ground up? Armed with subscription to Claude Pro, I gave it a shot. Starting from zero gave me an appreciation of how much functionality we take for granted from similar modern-day GUI applications. I added one dependency, [Yjs](https://yjs.dev/), to get a persistent local data store, undo/redo, and multi-user sync.

A month or so and a few thousand lines of code later, I had a graphical infinite canvas environment with panning, zooming, selection, dragging, resizing, and copy/paste working—basically the basics of tldraw, not nearly as polished, and still without important pieces of functionality. But in exchange, we gained control of the codebase and full freedom in changing the user interface to suit our needs. We decided to forge ahead with this codebase.

### AI AI AI

When we would describe the project to others, invariably people would start talking about AI. **Won't the problem of end-user programming go away with AI?** people ask. No, we don't believe so. The whole reason why programming languages exist is because they're precise; natural language is not. With today's LLMs, you end up with pages of AI-generated code, even if it's hidden away under a shiny UI, and you're left helpless when something doesn't work the way you intended.

We believe that [going from a prompt in English to pages of React code is way too big of a leap for non-programmers](https://bsky.app/profile/jrcpl.us/post/3lgoal4gy7s2o). What's needed is a medium — a substrate, if you will — in which you configure and compose software building blocks, more like Legos. This would provide the missing middle ground between natural language and programming language, where humans and AI can collaborate on equal footing.

Well, it turns out that our system provides exactly this kind of substrate. All of our software building blocks, Things, [can be represented as plain text](https://xcancel.com/id_aa_carmack/status/1902088032519405919?s=46 data). A simple text field containing the text "Ahoy, world!" looks like this:

```
{
    "name": "aplomb",
    "type": "thing:text",
    "x": 296,
    "y": 98,
    "width": 100,
    "height": 24,
    "visible": true,
    "borderColor": "#000000",
    "borderWidth": 2,
    "borderRadius": 0,
    "backgroundColor": "#ffffff",
    "opacity": 100,
    "fontFamily": "sans-serif",
    "fontSize": 16,
    "textColor": "#000000",
    "alignHorizontal": "left",
    "value": "Ahoy, world!",
    "id": "ahoy:e757e02f-9089-4e42-9570-ed5f30830739"
}
```

Even though it's in a computer-readable format (JSON), this data is simple enough for a human to look at and understand. Our graphical editor is simply taking the same data and presenting it in a more visual format. When you copy a Thing to the clipboard, you're copying this JSON representation.

One of the technical problems I had to solve was how to encode all the knowledge about a Thing, i.e. its metadata, in order to present it in the properties inspector and provide a nice user experience. For example, a Button has certain properties, like "height" and "background color" and "id". Underneath the hood, those are simply stored as numbers and strings. But in the user interface, I wanted to do things like prohibit the user from entering a negative number for the height, summon a graphical picker for choosing the color, and prohibit the user from editing the id altogether. I had to encode this kind of knowledge somehow. It can be done with TypeScript, but it can't be used at runtime. I also wanted to have human-readable descriptions for each of the properties and Things as a whole, which isn't a job for TypeScript types.

I started putting all that stuff in code as a static data, but editing properties required touching multiple areas, and that became error prone. Eventually I settled on using JSDoc to store the metadata directly at the point of property definition, and writing a custom script to run at build-time to parse all the JSDoc tags and output a file containing all the metadata of all the Things. In other words, now I had all the knowledge about all the Things in one big JSON file.

As an experiment, I tried feeding that big JSON file to Claude AI, with some custom instructions so that it would respond with Things in JSON format, rather than React code. I tried asking it to produce a few examples, like a simple alarm clock and a calculator. It obediently generated a bunch of Things, which I could then copy and paste into our prototype. And, for the most part, they worked! Importantly, you could still continue to edit and build upon those Things.

This felt like a breakthrough moment. We proved the concept of having a middle-ground substrate where you configure and compose software building blocks, with or without the help of AI. Whatever you create remains understandable and fully customizable. You're not dependent on interacting with a big black box with magic inside. Ultimately, we want our system to be [maximally transparent, understandable, and reliable](https://dynamicland.org/2024/FAQ/#What_is_Realtalks_relationship_to_AI), which means not having AI at the core of the product.

### Compared to HyperCard

There have been a number of successors to HyperCard, both commercial ([HyperStudio](https://www.mackiev.com/hyperstudio/), [SuperCard](https://en.wikipedia.org/wiki/SuperCard), [LiveCode](https://livecode.com/)) and non-commercial ([Decker](https://beyondloom.com/decker/) and [WildCard](https://hypervariety.com/WildCard/), among a number of open-source remakes, most of which are abandonware). Most of these have been quite literal replicas of HyperCard, down to the black-and-white graphics.

We wanted to create something in the spirit of HyperCard, rather than recreate HyperCard. Our prototype system is different from HyperCard and its direct descendants in a few key ways:

- Above all, we designed it for the Internet, so data lives in a world that's not only persistent but also naturally shareable online, in the form of simple share links, and without the friction of user accounts.
- We chose to use JavaScript, a widely-used programming language that's native to the web, rather than any new or derivative language.
- We also designed it around rich JSON data types, rather than only text, and we represent data in plain JSON, rather than a proprietary binary format.
- We chose to incorporate modern reactive data flow patterns in the form of formulas, which should be familiar to any spreadsheet user.
- We added a larger palette of interactive data objects than HyperCard, which only had buttons, text fields, and bitmapped graphics.

### The non-success of substrates

It is not an exaggeration to say that HyperCard single-handedly popularized the concept of hypermedia. Years later, it would be credited by the inventors of the [World Wide Web](https://web.archive.org/web/20110106041256/http://www.computer.org/portal/web/computingnow/ic-cailliau), [the wiki](https://wiki.c2.com/?WikiWikiHypercard), and [JavaScript](https://www.quora.com/What-is-the-origin-of-lower-casing-DOM-object-events-and-event-methods). And yet, there hasn't been anything like HyperCard since its time. **Why not?**

First, HyperCard died in part because even Apple didn't know what to do with it. [HyperCard was born](https://en.wikipedia.org/wiki/HyperCard#History) inside Apple as a free product, then moved out of Apple (along with the rest of Apple's application software) and turned into a commercial product, and then moved back into Apple (in the QuickTime team) as a free product again, where it languished. Against Apple's "beleaguered" financial situation, strategic focus on sexy new hardware products and the Internet, and platform transition to Mac OS X, HyperCard succumbed.

In his ["A Eulogy for HyperCard"](https://due-diligence.typepad.com/blog/2004/03/a_eulogy_for_hy.html), Tim Oren diagnosed the problem: "HyperCard always had a marketing problem of not being clearly about any one thing." He explained that HyperCard enabled a "burst of creativity by users" but that "the proliferation of ideas created its own confusion. What was this thing? Programming and user interface design tool? Lightweight database and hypertext document management system? Multimedia authoring environment? Apple never answered that question." From the very beginning, there was also a fear of "competing with our developers", of weakening the third-party Macintosh software market that Apple needed to be strong, because ultimately Apple made money selling computers.

In terms of interactive media authoring, the biggest success after HyperCard was arguably [Adobe Flash](https://en.wikipedia.org/wiki/Adobe_Flash). Like HyperCard, Flash provided a visual environment that enabled non-programmers to create interactive experiences. It had a scripting language called ActionScript, which was influenced by HyperCard's own scripting language. Flash came to power everything from simple animations to complex games on the web in the late 1990s and 2000s. It worked across browsers and platforms, which is something HyperCard never achieved beyond the Apple ecosystem. But Flash suffered a similar fate, as it was never designed for mobile devices and touchscreens, and web technologies steadily became more capable of delivering rich interactive media.

Since HyperCard and Flash, there have been a number of other projects with similar goals, including [Etoys](<https://en.wikipedia.org/wiki/Etoys_(programming_language)>) and [Lively Kernel](https://lively-kernel.org/) from the programming side, and [Dynamicland](https://dynamicland.org/) , [Tapestry](https://futuretextlab.info/2025/01/12/conversation-about-tapestry-ai/), and [Kosmik](https://www.kosmik.app/) from the media side. Notably, after a [demonstration by Lively Kernel creator Dan Ingalls](https://www.youtube.com/watch?v=gGw09RZjQf8), an audience member made the following comment (at 51:52):

> "We've had Smalltalk, we've had Squeak for a really long time. These are frequently shown off as like, 'Look, it's a great prototype of'… what? What's the business model or what's the development model?
>
> Like, you've got some buttons, you push them, they go beep. That's great. But in a deployed application, I certainly don't want people to be able to arbitrarily interact with or browse the code.
>
> What is it you hope people build? … Saying 'I hope people build' is perfectly legitimate in educational environments, or in whiteboarding environments. Do you see this being useful beyond that?

In his answer, Ingalls alluded to the use case of "mashups" and responded to the commenter's concerns about lack of mechanisms for producing stable software for real-world use, like versioning, by saying that the system was still a "proof of concept". When asked "What's it a proof of concept of? What's the final model? What would that look like?", he responded with a nebulous, meandering answer, finally stating that "it's a prototyping environment" but "I'm not going to limit it."

We can clearly see that it's hard to market and sell something that fundamentally can be many things to many people. But Apple actually faced this problem before, when it needed to [market personal computers in the early 1980s](https://bsky.app/profile/jrcpl.us/post/3lfzj7xot5c2p) and again when it needed to [market smartphones in 2008](https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/). With personal computers, it took some time but ["killer application"](https://en.wikipedia.org/wiki/Killer_application) use cases emerged, with gaming, word processing, and spreadsheets for the Apple II and later desktop publishing for the Macintosh. In contrast, with the iPhone, Steve Jobs identified three reasons for why you'd want it in your pocket ("a widescreen iPod with touch controls; a revolutionary mobile phone; and a breakthrough Internet communications device") right from the beginning.

Meanwhile, with substrates, it's been decades and no obvious killer apps have emerged. There are plenty of fun and interesting demos, but education, casual gaming, and scrapbooking seem to be the most compelling use cases so far. The one standout success story is Myst, the best-selling PC game prior to The Sims: Myst was actually a [heavily pimped-up HyperCard stack](https://en.wikipedia.org/wiki/Myst#Production). Perhaps, at least for marketing purposes, we need to focus on a few use cases, stealing a page from Steve Jobs' playbook. That said, even though we've compiled our own catalog of use cases (described above), we're still having trouble imagining how we would use our prototype as a daily driver ourselves.

[In his talk, Jonathan Edwards suggests](https://www.youtube.com/live/4GOeYylCMJI?si=yXrIRLY7L94Q_QMY&t=2286) that we focus on the gap between spreadsheets and "stack programming". This is the same gap that we identified early in our project. Perhaps that’s the ultimate killer app of substrates: to serve the long tail that's not otherwise being served. HyperCard clearly served the long tail well, although I think that's partially because people didn't have real alternatives during that time. Sometimes we forget how life was like in that era. Hardware was slow, operating systems crashed, and compilers cost money. There was no Google, Stack Overflow, or GitHub Copilot; there were books and CD-ROMs of technical documentation, often well-written but expensive and rare. For a normal person in the late 1980s and early 1990s, HyperCard was like an oasis in a desert. Today, there are more, different solutions out there that cater to the long tail.

Finally, perhaps we're still too attached to the model of desktop GUI object toolkits. Perhaps post-HyperCard systems shouldn't look so much like HyperCard at all. Perhaps we should look to, say, Minecraft as a contemporary example of a commercially successful substrate. After all, Minecraft is widely approachable for non-programmers, doesn't feel like a programming environment, is fully open-ended, privileges media over computation, supports adding interactivity and logic, persists data transparently, and runs locally while allowing online real-time multiplayer real-time sharing.

### Future directions

With our current prototype, we think that we've been successful at proving the ideas and design principles that we started with. But there's a lot more work to do. The number of Scrapps that can be built in a way that feel “native” is still low. Much of the time, existing knowledge of JavaScript is required. To improve this, we need to continue work in both "lowering the floor" and "raising the ceiling".

Lowering the floor means making things more friendly and approachable for people with little or no programming experience. For example:

- **Support mobile/touch UI, at least optimized for using**. A hand-sized touchscreen doesn't especially facilitate content creation and editing, but you should definitely be able to share Scrapps and have them be usable on mobile devices. Currently this doesn't work very well. One fundamental design decisions we made was to adopt the infinite canvas paradigm, which means that objects have fixed positions. This gives a way simpler mental model than what you get with CSS, but it precludes designing for responsiveness. However, drag-and-drop web page design tools like mmm.page and Squarespace show a way to handle this: simply show safe areas for mobile to the user.
- **Improve the developer experience**. One of the basic ways that we made coding easier is to auto-name all the objects and present the names visually on the screen. But there's a ton more than we can do. You could be able to point and click to objects instead of typing their names. You should be able to visually see relationships between objects. You should be able to get auto-completion so you don't have to remember code syntax and do so much typing. You should be able to pause and inspect state and do live debugging.
- **Leverage AI** to assist the user, where it makes sense. We can imagine building in the possibility for you to ask an AI to help you write little snippets of JavaScript code.
- **Make it even easier to share and remix**. It's easier to learn by inspecting and tweaking other people' work than it is to start from a blank canvas. The main mode of operation we imagine is for users to publish their creations, perhaps in a public gallery, and other users can adopt and customize them for their own needs and preferences.
- **Support building data flows**. A number of use cases in end-user programming involve building data flows which do some processing in response to a trigger event. Apple Shortcuts, IFTTT, and Zapier are examples of this. Our Things could in theory be designed to be more "pipeable", so the output of a Thing can be connected to the input of another Thing. Although we've designed Scrappy to be local-first, there are cases where it's useful for Scrapps to continue to exist and do work even when the user's device is off.

Raising the ceiling mades adding functionality and expressive power, letting users create more things with less effort. For example:

- **Add support for collections**. Currently, you can edit and store a number of different types of data, including strings, numbers, dates, and JSON data, and place them freely on the infinite canvas. But you can't make an editable table of those things, as you have in spreadsheets and Notion. We don't have any kind of layout containers, like lists, grids, or stacks. Even HyperCard has this: a HyperCard document (”stack”) is conceptually a collection of cards, so it's straightforward and natural to build an address book, flash cards, slideshow, adventure game, or e-book.
- **Add support for prototypes.** Currently, you can configure a Thing as you see fit, but you can't make a bunch of similar Things other than by copying them. We don't have any mechanism for defining a prototypical Thing whose customizations are automatically synced across multiple instances. For example, if you're making a word game with many similar fields or buttons, you should be able to make a prototype or master Thing and then use instances of that. Figma has components, PowerPoint has slide masters, HyperCard has card backgrounds, all to this effect.
- Specifically for implementing forms in the shared canvas paradigm, this would essential. Currently, you can visually group a collection of Things in a Frame and share the Frame, but that Frame is fully synced in real-time across users. This is desirable in some cases and not desirable in other cases, namely when each user should only see and edit their own copy of the form. You should be able to define a prototype or master of the form, then share instances of that form, but submitting the form still adds data to the same shared, single place.
- **Clean up Things conceptually**. Currently, some Things store data values, and some things support event handlers like "when clicked" and "when changed" handlers. The current implementation is a bit arbitrary about this, which is not only confusing but also limiting. Common behaviors like editing, clicking, and storing data should be made more consistent and freely “mixable”.
- **Allow encapsulation and extension**. Currently, you can't define new Things. We want you to be able to piece together Things and treat that collection as a new, higher-level Thing that can be easily shared. And we want you to be able to write entirely new Things, perhaps through a plug-in mechanism.
