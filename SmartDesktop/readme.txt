The Smart Mobile Studio Desktop (A.k.a Amibian.js)
Written by Jon Lennart Aasenden, all rights reserved
Amibian is copyright Gunnar Kristjansson.

** Requirements

This application requires the NG (next generaton) edition of the Smart Mobile Studio runtime library.
As of writing (04.03.2017) this version of the RTL is not yet released, but should be in the
update "alpha channel" sometimes next week. A statement will be issued on www.smartmobilestudio.com
and on our G+ and Facebook groups.

It has been compiled with an older version of Smart Mobile Studio, version 2.2.1.45.
Which is the version I use when writing the RTL, basically because this ensures that the code
must be backward compatible (that version uses CEF3 while the NG IDE uses CEF4).

** About

The Smart Desktop is a quick and dirty implementation of the Amiga OS 4 Workbench.
While appearance is one thing (which is easy under HTML), it does have some factors that requires
a lot of coding to get right:

 - Implements a filesystem class over LocalStorage and Sessionstorage
 - Ships with UAE.js that runs actual 68k Amiga software (!)
 - Ships with Webkit.js, which renders HTML offscreen and do complex compositing
 - Talks to the node.js backend server
 - Implements isolated focus handling (which is a bitch under HTML5)
 - Uses our layout library (a good demonstration) SmartCL.Layout.pas
 - Demonstrates out-of-view controls, the menu header is created outside the desktop view.
   All controls are created inside Application->Display->View, while the menu is
   created directly in Application->Display. It is thus un-affected by scrolling and what
   takes place inside the default view.

Note: This is work in progress! Right now you have some oddities, like when you double-click on
      Ram-Disk you get the preferences window. But that will be fixed as we move along :)
      The most important part was to get the general behavior in-place before the styling and
      file-recognition is dealt with.
      Traditionally the preferences application can be found under System:Prefs/Preferences[exe]

** Uses

While initially created as a way to show-off some of the new features, the Smart Desktop has
been instrumental in testing the next-generation RTL. If our RTL cannot be used to write
complex software, then the product is worthless.
The SMS desktop is about as complex as it gets. Wrapping full emulation systems like UAE,
dealing with both normal and external windows (external being IFrames hosted at other domains).
We also deal with global preferences, a local filesystem - not to mention direct contact with
the node.js backend.

But the use doesnt end with testing. The desktop is being used as the foundation for Amibian, which
is a popular Linux distro for ARM embedded boards. It is designed to emulate a real 1990's Amiga
system. While the Smart Pascal side of things is important -- Ambian is equally important since this
is ultimately a labour of love. We are huge Amiga fans and making a JS desktop in the shape of OS 4
is both an ODE to the Amiga - and to libraries like CODEF, which is so inspiring to old hackers like
ourselves.

A special thanks to Gunnar Kristjansson for testing, and also Thomas Navarro Garcia!
Both of them work on the binary Amibian distro, and they also help me create the JS version of Amibian.
Which I believe is one of the first meta-desktops running purely on JavaScript technology (node.js being the backend).

It is also used by "Symbiotic elements" as the foundation for their node.js based NAS systems.
Where you log-in to your NAS through the browser to setup rules, work with files and do general
management.

** Legal uses

The desktop code will be updated here on GitHub on regular basis. It is important to note that
YOU ARE NOT ALLOWED TO DISTRIBUTE OR USE the code unless you own Smart Mobile Studio.
For commercial work please contact the author, Jon L. Aasenden, for licensing.
Non-commercial projects can use the code freely, as long as the origin is visually represented (for example in the about box).

** Update frequency

Secondly, the GIT repository may not be the absolute bleeding edge.
This first commit excludes the new server code which is in a separate folder. This is just lazyness on
my part since I have a lot to do right now.
I will join the projects later when we are not so busy getting the RTL in shape.



Regards

Jon Lennart Aasenden
