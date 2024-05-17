import * as preact from 'preact';
import * as preactHooks from 'preact/hooks';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Draggable);

if (import.meta.env.DEV) {
  const prefresh = await import("@prefresh/core");
  const { flush } = await import("@prefresh/utils");

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

  self.flushUpdates = flush;
}

self.preact = preact;
self.preactHooks = preactHooks;
self.gsap = gsap;
self.draggable = Draggable;
self.useGSAP = useGSAP;
