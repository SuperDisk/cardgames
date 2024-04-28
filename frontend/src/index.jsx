import * as preact from 'preact';
import * as preactHooks from 'preact/hooks';
import * as dndKit from '@dnd-kit/core'

import React from 'react';
import {useDraggable} from '@dnd-kit/core';

import "@prefresh/core";
import {flush as flushUpdates} from "@prefresh/utils";

self.$RefreshReg$ = (type, id) => {
  self.__PREFRESH__.register(type, "gorgus" + " " + id);
};

self.$RefreshSig$ = () => {
  let status = 'begin';
  let savedType;
  return (type, key, forceReset, getCustomHooks) => {
    if (!savedType) savedType = type;
    status = self.__PREFRESH__.sign(type || savedType, key, forceReset, getCustomHooks, status);
    return type;
  };
};


function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

self.Draggable = Draggable;

self.preact = preact;
self.preactHooks = preactHooks;
self.flushUpdates = flushUpdates;
self.dndKit = dndKit;
