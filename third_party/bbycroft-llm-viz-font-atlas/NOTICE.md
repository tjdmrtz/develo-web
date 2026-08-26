# Font atlas notice for the adapted bbycroft/llm-viz renderer

The runtime files:

- font-atlas.png
- font-def.json

are copied unchanged from bbycroft/llm-viz commit
9da93742382f1bf36c020c38a1ace454e82c4490.

The upstream atlas generator is:
https://github.com/bbycroft/llm-viz/blob/9da93742382f1bf36c020c38a1ace454e82c4490/create-font-atlas.jsm

That generator builds the atlas from:
- Roboto-Regular.ttf
- cmmi12.ttf
- cmsy10.ttf
- cmr12.ttf

Roboto licensing:
Apache License 2.0.
Copyright 2012, 2013 The Roboto Authors.
Reference:
https://android.googlesource.com/platform/external/roboto-fonts/

Computer Modern/BaKoMa licensing:
BaKoMa Fonts Licence.
Copyright (C) 1994, 1995, Basil K. Malyshev. All Rights Reserved.
Original collection:
http://www.ctan.org/tex-archive/fonts/cm/ps-type1/bakoma

Only the generated PNG/JSON runtime atlas is shipped by this Develo
feature. The source TTF files are not exposed or distributed by the
Develo website runtime.
