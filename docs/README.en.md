# RPG Maker MV Actor Storage Plugin

A plugin for RPG Maker MV that provides an actor deposit/storage system.

## Features

- Store and retrieve party members in a dedicated storage system
- View detailed status information for stored actors
- "Farewell" system to permanently remove actors
- Configurable maximum party size
- Easy-to-use menu interface for managing actors

## Installation

1. Copy `ActorStorage.js` from the `dist` folder to your RPG Maker MV project's `js/plugins` folder
2. Enable the plugin in the Plugin Manager

## Usage

### Plugin Commands

- `ActorStorage open` - Opens the actor storage menu

### Menu Interface

- Switch between party members and stored actors
- View detailed actor status information
- Add/remove actors from party
- Permanently dismiss actors with confirmation

## Building

To build the plugin from source:

```sh
npm install
npm run build
```
