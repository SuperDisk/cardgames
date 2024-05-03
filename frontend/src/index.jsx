import * as preact from 'preact';
import * as preactHooks from 'preact/hooks';
import * as dndKit from '@dnd-kit/core'
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable);

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

self.preact = preact;
self.preactHooks = preactHooks;
self.flushUpdates = flushUpdates;
self.dndKit = dndKit;
self.gsap = gsap;
self.useGSAP = useGSAP;
self.draggable = Draggable;
