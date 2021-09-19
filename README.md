# Bilkent STARS Enhancer

A **Firefox** Web Extension that provides much-needed functionality to certain parts of the Bilkent STARS platform.
Most of the background heavylifting is done by an Azure Functions app running Node.js.

## Features

* **Automatically** pass the 2FA login by providing the extension a mailbox receiving the authentication codes.
* Mailbox credentials are encrypted with a symmetric key on an Azure Functions app (included within this repo), then stored on the browser storage safely. All credential transmissions are carried out over secure connections.
* SRS and Webmail login forms are fixed in order to support browser/extension auto-fill.
* Offerings table is made sticky to follow the user down the page.
* Instructor evaluation buttons on the offerings table are resolved from JS links to absolute links, allowing more productivity when going through numerous evaluations.
* Basic options page where webmail credentials must be provided.
* Automatic updates to the extension.
* More features to come?

## Installation & Usage

Obtain the extension from this [link](https://vedat.xyz/bilkent-stars-extension/bstars-ext-2.1.0.xpi). To be able to use the 2FA auto-fill, you will need to provide the extension with your webmail credentials and the name of a mailbox that will be receiving **solely** your STARS authentication codes. Needless to say, this means you *must* be receiving your SRS 2FA codes through mail rather than SMS. You can set up a mail filter through the [webmail interface](https://webmail.bilkent.edu.tr/?_task=settings&_action=plugin.managesieve) to direct all mails from `starsmsg@bilkent.edu.tr` containing the subject segment `Secure Login Gateway` to a specific mailbox (i.e., called *STARS Auth*). The rest of the features do not currently require user action to be activated.

## Regarding browser support

As far as I'm aware, the extension currently works fully **only on Firefox**. It was more of a hassle than initially imagined to get it working for Chrome, and as such, I've decided not to bother for the time being. Maybe in the future, with more free time on my hands, I might reconsider.
