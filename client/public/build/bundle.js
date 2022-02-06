
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update$1(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var Adjustments = [[{"d":"M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"}]];

    var Chip = [[{"d":"M13 7H7v6h6V7z"},{"fill-rule":"evenodd","d":"M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"}]];

    var FingerPrint = [[{"fill-rule":"evenodd","d":"M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z","clip-rule":"evenodd"},{"fill-rule":"evenodd","d":"M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z","clip-rule":"evenodd"},{"fill-rule":"evenodd","d":"M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"}]];

    var Folder = [[{"d":"M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"}]];

    var Hashtag = [[{"fill-rule":"evenodd","d":"M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M7 20l4-16m2 16l4-16M6 9h14M4 15h14"}]];

    var Home = [[{"d":"M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"}]];

    var Key = [[{"fill-rule":"evenodd","d":"M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"}]];

    var LockClosed = [[{"fill-rule":"evenodd","d":"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"}]];

    var Moon = [[{"d":"M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"}]];

    var Plus = [[{"fill-rule":"evenodd","d":"M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 4v16m8-8H4"}]];

    var Refresh = [[{"fill-rule":"evenodd","d":"M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"}]];

    var Server = [[{"fill-rule":"evenodd","d":"M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"}]];

    var Sun = [[{"fill-rule":"evenodd","d":"M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"}]];

    var Terminal = [[{"fill-rule":"evenodd","d":"M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"}]];

    var UserCircle = [[{"fill-rule":"evenodd","d":"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"}]];

    /* node_modules\svelte-hero-icons\Icon.svelte generated by Svelte v3.46.3 */

    const file$a = "node_modules\\svelte-hero-icons\\Icon.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (22:0) {#if src && src != []}
    function create_if_block$7(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*solid*/ ctx[2]) return create_if_block_1$2;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(22:0) {#if src && src != []}",
    		ctx
    	});

    	return block;
    }

    // (38:2) {:else}
    function create_else_block$5(ctx) {
    	let svg;
    	let each_value_1 = /*src*/ ctx[1][1] ?? [];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ fill: "none" },
    		{ viewBox: "0 0 24 24" },
    		{ stroke: "currentColor" },
    		{ class: /*customClass*/ ctx[3] },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*$$restProps*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$a, 38, 4, 765);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*src*/ 2) {
    				each_value_1 = /*src*/ ctx[1][1] ?? [];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ fill: "none" },
    				{ viewBox: "0 0 24 24" },
    				{ stroke: "currentColor" },
    				dirty & /*customClass*/ 8 && { class: /*customClass*/ ctx[3] },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(38:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if solid}
    function create_if_block_1$2(ctx) {
    	let svg;
    	let each_value = /*src*/ ctx[1][0] ?? [];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ fill: "currentColor" },
    		{ viewBox: "0 0 20 20" },
    		{ class: /*customClass*/ ctx[3] },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*$$restProps*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$a, 23, 4, 446);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svg, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*src*/ 2) {
    				each_value = /*src*/ ctx[1][0] ?? [];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(svg, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ fill: "currentColor" },
    				{ viewBox: "0 0 20 20" },
    				dirty & /*customClass*/ 8 && { class: /*customClass*/ ctx[3] },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(23:2) {#if solid}",
    		ctx
    	});

    	return block;
    }

    // (49:6) {#each src[1] ?? [] as att}
    function create_each_block_1(ctx) {
    	let path;
    	let path_levels = [/*att*/ ctx[5]];
    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$a, 50, 8, 1047);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [dirty & /*src*/ 2 && /*att*/ ctx[5]]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(49:6) {#each src[1] ?? [] as att}",
    		ctx
    	});

    	return block;
    }

    // (33:6) {#each src[0] ?? [] as att}
    function create_each_block(ctx) {
    	let path;
    	let path_levels = [/*att*/ ctx[5]];
    	let path_data = {};

    	for (let i = 0; i < path_levels.length; i += 1) {
    		path_data = assign(path_data, path_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			set_svg_attributes(path, path_data);
    			add_location(path, file$a, 34, 8, 708);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(path, path_data = get_spread_update(path_levels, [dirty & /*src*/ 2 && /*att*/ ctx[5]]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(33:6) {#each src[0] ?? [] as att}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let if_block = /*src*/ ctx[1] && /*src*/ ctx[1] != [] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*src*/ ctx[1] && /*src*/ ctx[1] != []) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["src","size","solid","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { src = [] } = $$props;
    	let { size = "100%" } = $$props;
    	let { solid = false } = $$props;
    	let { class: customClass = "" } = $$props;

    	if (size !== "100%") {
    		if (size.slice(-1) != "x" && size.slice(-1) != "m" && size.slice(-1) != "%") {
    			try {
    				size = parseInt(size) + "px";
    			} catch(error) {
    				size = "100%";
    			}
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('src' in $$new_props) $$invalidate(1, src = $$new_props.src);
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('solid' in $$new_props) $$invalidate(2, solid = $$new_props.solid);
    		if ('class' in $$new_props) $$invalidate(3, customClass = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({ src, size, solid, customClass });

    	$$self.$inject_state = $$new_props => {
    		if ('src' in $$props) $$invalidate(1, src = $$new_props.src);
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('solid' in $$props) $$invalidate(2, solid = $$new_props.solid);
    		if ('customClass' in $$props) $$invalidate(3, customClass = $$new_props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, src, solid, customClass, $$restProps];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { src: 1, size: 0, solid: 2, class: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get src() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get solid() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set solid(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\sidebar\SideBarIcon.svelte generated by Svelte v3.46.3 */
    const file$9 = "src\\components\\sidebar\\SideBarIcon.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let icon_1;
    	let t0;
    	let span;
    	let t1;
    	let current;

    	icon_1 = new Icon({
    			props: { src: /*icon*/ ctx[0], size: "26" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon_1.$$.fragment);
    			t0 = space();
    			span = element("span");
    			t1 = text(/*text*/ ctx[1]);
    			attr_dev(span, "class", "sidebar-tooltip group-hover:scale-100");
    			add_location(span, file$9, 7, 4, 185);
    			attr_dev(div, "class", "sidebar-icon group");
    			add_location(div, file$9, 5, 0, 110);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon_1, div, null);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const icon_1_changes = {};
    			if (dirty & /*icon*/ 1) icon_1_changes.src = /*icon*/ ctx[0];
    			icon_1.$set(icon_1_changes);
    			if (!current || dirty & /*text*/ 2) set_data_dev(t1, /*text*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideBarIcon', slots, []);
    	let { icon } = $$props;
    	let { text } = $$props;
    	const writable_props = ['icon', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideBarIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ Icon, icon, text });

    	$$self.$inject_state = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, text];
    }

    class SideBarIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { icon: 0, text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBarIcon",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[0] === undefined && !('icon' in props)) {
    			console.warn("<SideBarIcon> was created without expected prop 'icon'");
    		}

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<SideBarIcon> was created without expected prop 'text'");
    		}
    	}

    	get icon() {
    		throw new Error("<SideBarIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<SideBarIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SideBarIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SideBarIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\sidebar\SideBarDivider.svelte generated by Svelte v3.46.3 */

    const file$8 = "src\\components\\sidebar\\SideBarDivider.svelte";

    // (6:0) {:else}
    function create_else_block$4(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			attr_dev(hr, "class", "sidebar-hr");
    			add_location(hr, file$8, 6, 4, 112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(6:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (4:0) {#if hide}
    function create_if_block$6(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			attr_dev(hr, "class", "hidden sidebar-hr");
    			add_location(hr, file$8, 4, 4, 65);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(4:0) {#if hide}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*hide*/ ctx[0]) return create_if_block$6;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideBarDivider', slots, []);
    	let { hide } = $$props;
    	const writable_props = ['hide'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideBarDivider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hide' in $$props) $$invalidate(0, hide = $$props.hide);
    	};

    	$$self.$capture_state = () => ({ hide });

    	$$self.$inject_state = $$props => {
    		if ('hide' in $$props) $$invalidate(0, hide = $$props.hide);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hide];
    }

    class SideBarDivider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { hide: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBarDivider",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hide*/ ctx[0] === undefined && !('hide' in props)) {
    			console.warn("<SideBarDivider> was created without expected prop 'hide'");
    		}
    	}

    	get hide() {
    		throw new Error("<SideBarDivider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hide(value) {
    		throw new Error("<SideBarDivider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const SideBarIconIds = {
        home: 0,
        application: 1,
        options: 2,
        console: 3,
        files: 4,
        access: 5,
        create_application: 6,
        applications: 7,
        settings: 8
    };

    /* src\components\sidebar\SideBar.svelte generated by Svelte v3.46.3 */
    const file$7 = "src\\components\\sidebar\\SideBar.svelte";

    // (9:4) {#if !hideIcon.includes(SideBarIconIds.home) }
    function create_if_block_8(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Home, text: "Home" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(9:4) {#if !hideIcon.includes(SideBarIconIds.home) }",
    		ctx
    	});

    	return block;
    }

    // (12:4) {#if !hideIcon.includes(SideBarIconIds.application) }
    function create_if_block_7(ctx) {
    	let sidebardivider;
    	let t;
    	let sidebaricon;
    	let current;
    	sidebardivider = new SideBarDivider({ props: { hide: false }, $$inline: true });

    	sidebaricon = new SideBarIcon({
    			props: { icon: Chip, text: "Application" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebardivider.$$.fragment);
    			t = space();
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebardivider, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebardivider.$$.fragment, local);
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebardivider.$$.fragment, local);
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebardivider, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(12:4) {#if !hideIcon.includes(SideBarIconIds.application) }",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if !hideIcon.includes(SideBarIconIds.options) }
    function create_if_block_6(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Adjustments, text: "Options" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(16:4) {#if !hideIcon.includes(SideBarIconIds.options) }",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if !hideIcon.includes(SideBarIconIds.console) }
    function create_if_block_5(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Terminal, text: "Console" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(19:4) {#if !hideIcon.includes(SideBarIconIds.console) }",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#if !hideIcon.includes(SideBarIconIds.files) }
    function create_if_block_4$1(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Folder, text: "Files" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(22:4) {#if !hideIcon.includes(SideBarIconIds.files) }",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if !hideIcon.includes(SideBarIconIds.access) }
    function create_if_block_3$1(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Key, text: "Access" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(25:4) {#if !hideIcon.includes(SideBarIconIds.access) }",
    		ctx
    	});

    	return block;
    }

    // (28:4) {#if !hideIcon.includes(SideBarIconIds.create_application) }
    function create_if_block_2$1(ctx) {
    	let sidebardivider;
    	let t;
    	let sidebaricon;
    	let current;
    	sidebardivider = new SideBarDivider({ props: { hide: false }, $$inline: true });

    	sidebaricon = new SideBarIcon({
    			props: { icon: Plus, text: "Create Application" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebardivider.$$.fragment);
    			t = space();
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebardivider, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebardivider.$$.fragment, local);
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebardivider.$$.fragment, local);
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebardivider, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(28:4) {#if !hideIcon.includes(SideBarIconIds.create_application) }",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if !hideIcon.includes(SideBarIconIds.applications) }
    function create_if_block_1$1(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: {
    				icon: Server,
    				text: "Example Application"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(32:4) {#if !hideIcon.includes(SideBarIconIds.applications) }",
    		ctx
    	});

    	return block;
    }

    // (35:4) {#if !hideIcon.includes(SideBarIconIds.settings) }
    function create_if_block$5(ctx) {
    	let sidebardivider;
    	let t;
    	let sidebaricon;
    	let current;
    	sidebardivider = new SideBarDivider({ props: { hide: false }, $$inline: true });

    	sidebaricon = new SideBarIcon({
    			props: { icon: FingerPrint, text: "Settings" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidebardivider.$$.fragment);
    			t = space();
    			create_component(sidebaricon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidebardivider, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(sidebaricon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebardivider.$$.fragment, local);
    			transition_in(sidebaricon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebardivider.$$.fragment, local);
    			transition_out(sidebaricon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidebardivider, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(sidebaricon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(35:4) {#if !hideIcon.includes(SideBarIconIds.settings) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let show_if_8 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.home);
    	let t0;
    	let show_if_7 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.application);
    	let t1;
    	let show_if_6 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.options);
    	let t2;
    	let show_if_5 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.console);
    	let t3;
    	let show_if_4 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.files);
    	let t4;
    	let show_if_3 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.access);
    	let t5;
    	let show_if_2 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.create_application);
    	let t6;
    	let show_if_1 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.applications);
    	let t7;
    	let show_if = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.settings);
    	let current;
    	let if_block0 = show_if_8 && create_if_block_8(ctx);
    	let if_block1 = show_if_7 && create_if_block_7(ctx);
    	let if_block2 = show_if_6 && create_if_block_6(ctx);
    	let if_block3 = show_if_5 && create_if_block_5(ctx);
    	let if_block4 = show_if_4 && create_if_block_4$1(ctx);
    	let if_block5 = show_if_3 && create_if_block_3$1(ctx);
    	let if_block6 = show_if_2 && create_if_block_2$1(ctx);
    	let if_block7 = show_if_1 && create_if_block_1$1(ctx);
    	let if_block8 = show_if && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			attr_dev(div, "class", "fixed top-0 left-0 h-screen w-16 flex flex-col bg-white dark:bg-gray-900 shadow-lg");
    			add_location(div, file$7, 7, 0, 332);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t3);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t4);
    			if (if_block5) if_block5.m(div, null);
    			append_dev(div, t5);
    			if (if_block6) if_block6.m(div, null);
    			append_dev(div, t6);
    			if (if_block7) if_block7.m(div, null);
    			append_dev(div, t7);
    			if (if_block8) if_block8.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*hideIcon*/ 1) show_if_8 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.home);

    			if (show_if_8) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*hideIcon*/ 1) show_if_7 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.application);

    			if (show_if_7) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*hideIcon*/ 1) show_if_6 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.options);

    			if (show_if_6) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_6(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*hideIcon*/ 1) show_if_5 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.console);

    			if (show_if_5) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_5(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*hideIcon*/ 1) show_if_4 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.files);

    			if (show_if_4) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_4$1(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*hideIcon*/ 1) show_if_3 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.access);

    			if (show_if_3) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_3$1(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div, t5);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*hideIcon*/ 1) show_if_2 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.create_application);

    			if (show_if_2) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block_2$1(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(div, t6);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*hideIcon*/ 1) show_if_1 = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.applications);

    			if (show_if_1) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block_1$1(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(div, t7);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*hideIcon*/ 1) show_if = !/*hideIcon*/ ctx[0].includes(SideBarIconIds.settings);

    			if (show_if) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);

    					if (dirty & /*hideIcon*/ 1) {
    						transition_in(if_block8, 1);
    					}
    				} else {
    					if_block8 = create_if_block$5(ctx);
    					if_block8.c();
    					transition_in(if_block8, 1);
    					if_block8.m(div, null);
    				}
    			} else if (if_block8) {
    				group_outros();

    				transition_out(if_block8, 1, 1, () => {
    					if_block8 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);
    			transition_in(if_block7);
    			transition_in(if_block8);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			transition_out(if_block8);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideBar', slots, []);
    	let { hideIcon } = $$props;
    	const writable_props = ['hideIcon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hideIcon' in $$props) $$invalidate(0, hideIcon = $$props.hideIcon);
    	};

    	$$self.$capture_state = () => ({
    		Home,
    		Plus,
    		Adjustments,
    		Chip,
    		Server,
    		Terminal,
    		Folder,
    		Key,
    		FingerPrint,
    		SideBarIcon,
    		SideBarDivider,
    		SideBarIconIds,
    		hideIcon
    	});

    	$$self.$inject_state = $$props => {
    		if ('hideIcon' in $$props) $$invalidate(0, hideIcon = $$props.hideIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [hideIcon];
    }

    class SideBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { hideIcon: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBar",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hideIcon*/ ctx[0] === undefined && !('hideIcon' in props)) {
    			console.warn("<SideBar> was created without expected prop 'hideIcon'");
    		}
    	}

    	get hideIcon() {
    		throw new Error("<SideBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideIcon(value) {
    		throw new Error("<SideBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    class NodeConnection {
        constructor(node) {
            this._packetHandler = [];
            this._node = node;
            this._webSocket = undefined;
        }
        sendPacket(packet) {
            this._webSocket.send(JSON.stringify(packet));
        }
        closeConnection() {
            if (this._webSocket != undefined) {
                this._webSocket.close();
                this._webSocket = undefined;
            }
        }
        createConnection() {
            return new Promise(resolve => {
                this.closeConnection();
                this._webSocket = new WebSocket("ws://" + this._node.host + ":" + this._node.port);
                this._webSocket.addEventListener('open', event => {
                    resolve(1);
                });
                this._webSocket.addEventListener('error', event => {
                    resolve(-1);
                });
                this._webSocket.addEventListener('open', ev => { this.handleOpen(ev); });
                this._webSocket.addEventListener('error', ev => { this.handleError(ev); });
                this._webSocket.addEventListener('message', ev => { this.handleMessage(ev); });
            });
        }
        handleOpen(event) {
        }
        handleError(event) {
        }
        handleMessage(event) {
            let data = JSON.parse(event.data);
            console.table(data);
            for (let i = 0; i < this._packetHandler.length; i++) {
                this._packetHandler[i](data);
            }
        }
        addHandler(handler) {
            return this._packetHandler.push(handler) - 1;
        }
        removeHandler(index) {
            this._packetHandler.splice(index, 1);
        }
        get node() {
            return this._node;
        }
        get webSocket() {
            return this._webSocket;
        }
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    class Packet {
        constructor(id, data) {
            this.id = id;
            this.uuid = v4();
            this.document = { data: data };
        }
    }

    class PacketOutLogin extends Packet {
        constructor(username, session) {
            super(1, { username: username, session: session });
        }
    }

    class PacketOutRequestSession extends Packet {
        constructor(username, password) {
            super(2, { username: username, password: password });
        }
    }

    class ApplicationError {
        constructor(id, message) {
            this._id = id;
            this._message = message;
        }
        get id() {
            return this._id;
        }
        get message() {
            return this._message;
        }
    }

    const ErrorIds = {
        node_connect: -1,
        create_session: -2,
        session_outdated: -3,
        create_account: -4
    };

    class PacketOutCreateAccount extends Packet {
        constructor(username, password, token) {
            super(3, { username: username, password: password, token: token });
        }
    }

    class ControlNode {
        constructor(id, host, port, user) {
            this._id = id;
            this._host = host;
            this._port = port;
            this._user = user;
        }
        connect() {
            if (this._nodeConnection == undefined) {
                this._nodeConnection = new NodeConnection(this);
            }
            return this._nodeConnection.createConnection();
        }
        destroyConnection() {
            if (this._nodeConnection != undefined) {
                this._nodeConnection.closeConnection();
            }
            this._nodeConnection = undefined;
        }
        createAccount(username, password, token) {
            return new Promise(resolve => {
                let handled = false;
                let handlerId = this._nodeConnection.addHandler(packet => {
                    if (packet.id == 3) {
                        // @ts-ignore
                        let result = packet.document.data.result;
                        this._nodeConnection.removeHandler(handlerId);
                        handled = true;
                        resolve(result ? 1 : 0);
                    }
                });
                this._nodeConnection.sendPacket(new PacketOutCreateAccount(username, password, token));
                setTimeout(() => {
                    if (!handled) {
                        this._nodeConnection.removeHandler(handlerId);
                        currentError.set(new ApplicationError(ErrorIds.create_account, "Account creation took to long"));
                        resolve(-1);
                    }
                }, 5000);
            });
        }
        requestUserData() {
            return new Promise(resolve => {
            });
        }
        requestLogin() {
            return new Promise(resolve => {
                let handled = false;
                let handlerId = this._nodeConnection.addHandler(packet => {
                    if (packet.id == 1) {
                        // @ts-ignore
                        let result = packet.document.data.result;
                        this._nodeConnection.removeHandler(handlerId);
                        handled = true;
                        resolve(result ? 1 : 0);
                    }
                });
                this._nodeConnection.sendPacket(new PacketOutLogin(this._user.username, this._user.session));
                setTimeout(() => {
                    if (!handled) {
                        this._nodeConnection.removeHandler(handlerId);
                        currentError.set(new ApplicationError(ErrorIds.session_outdated, "Session check took to long"));
                        resolve(-1);
                    }
                }, 5000);
            });
        }
        requestLoginSession(username, password, save) {
            return new Promise(resolve => {
                let handled = false;
                let handlerId = this._nodeConnection.addHandler(packet => {
                    if (packet.id == 2) {
                        // @ts-ignore
                        let result = packet.document.data.result;
                        // @ts-ignore
                        let session = packet.document.data.session;
                        this._nodeConnection.removeHandler(handlerId);
                        handled = true;
                        resolve(result ? session : undefined);
                    }
                });
                this._nodeConnection.sendPacket(new PacketOutRequestSession(username, password));
                setTimeout(() => {
                    if (!handled) {
                        this._nodeConnection.removeHandler(handlerId);
                        currentError.set(new ApplicationError(ErrorIds.create_session, "Creating a session took too long"));
                        resolve(undefined);
                    }
                }, 5000);
            });
        }
        hasUser() {
            return this._user.exists();
        }
        saveUser(username, session) {
            this._user.set(username, session);
            networkManager.update(value => {
                value.nodeManager.storeNodes();
                return value;
            });
        }
        get nodeConnection() {
            return this._nodeConnection;
        }
        get host() {
            return this._host;
        }
        set host(value) {
            this._host = value;
        }
        get port() {
            return this._port;
        }
        set port(value) {
            this._port = value;
        }
        get user() {
            return this._user;
        }
        set user(value) {
            this._user = value;
        }
        get id() {
            return this._id;
        }
        set id(value) {
            this._id = value;
        }
    }
    class StoredControlNode {
        constructor(id, host, port, user) {
            this.id = id;
            this.host = host;
            this.port = port;
            this.user = user;
        }
    }

    class ControlUser {
        constructor(username, session) {
            this.username = username;
            this.session = session;
        }
        set(username, session) {
            this.username = username;
            this.session = session;
        }
        delete() {
            this.username = null;
            this.session = null;
        }
        exists() {
            return !(this.username == null && this.session == null);
        }
    }

    class NodeManager {
        constructor() {
            this._nodes = [];
        }
        connect(resultCallback) {
            currentNode.update(nodeId => {
                let node = this.getNodeById(nodeId);
                node.connect().then(result => {
                    if (result == -1) {
                        currentError.set(new ApplicationError(ErrorIds.node_connect, "Error while connecting to the node[" + node.host + ":" + node.port + "]"));
                    }
                    resultCallback(result, node);
                });
                return nodeId;
            });
        }
        loadNodes() {
            const storedData = window.localStorage.getItem("nodes") ? JSON.parse(window.localStorage.getItem("nodes")) : [];
            for (let i = 0; i < storedData.length; i++) {
                const storedNode = storedData[i];
                if (storedNode.user == undefined) {
                    this._nodes.push(new ControlNode(storedNode.id, storedNode.host, storedNode.port, new ControlUser(undefined, undefined)));
                }
                else {
                    this._nodes.push(new ControlNode(storedNode.id, storedNode.host, storedNode.port, new ControlUser(storedNode.user.username, storedNode.user.session)));
                }
            }
            console.log("Loaded " + this._nodes.length + " Nodes.");
        }
        storeNodes() {
            const storedData = [];
            for (let i = 0; i < this._nodes.length; i++) {
                let node = this._nodes[i];
                storedData.push(new StoredControlNode(node.id, node.host, node.port, node.user));
            }
            window.localStorage.setItem("nodes", JSON.stringify(storedData));
        }
        addNode(host, port) {
            const id = this.findNewId();
            console.log("Added node[" + host + ":" + port + "]");
            this._nodes.push(new ControlNode(id, host, port, new ControlUser(undefined, undefined)));
            this.storeNodes();
            return id;
        }
        getNodeById(id) {
            for (let i = 0; i < this._nodes.length; i++) {
                if (this._nodes[i].id == id) {
                    return this._nodes[i];
                }
            }
            return undefined;
        }
        findNewId() {
            let id = 0;
            while (this.getNodeById(id) != undefined) {
                id++;
            }
            return id;
        }
        testNode(host, port, successCallback, errorCallback) {
            let testSocket = new WebSocket("ws://" + host + ":" + port);
            let success = false;
            testSocket.onerror = event => {
                errorCallback();
            };
            testSocket.onopen = event => {
                setTimeout(() => {
                    if (!success) {
                        testSocket.close();
                        errorCallback();
                    }
                }, 5000);
            };
            testSocket.onmessage = event => {
                testSocket.close();
                success = true;
                successCallback();
            };
        }
        get nodes() {
            return this._nodes;
        }
    }

    class NetworkManager {
        constructor() {
            this._nodeManager = new NodeManager();
            console.log("Initializing the networkManager...");
        }
        prepareManager() {
            this._nodeManager.loadNodes();
        }
        get nodeManager() {
            return this._nodeManager;
        }
    }

    const darkMode = writable(window.localStorage.getItem("darkMode") ? Boolean(JSON.parse(window.localStorage.getItem("darkMode"))) : false);
    const currentNode = writable(window.localStorage.getItem("currentNode") ? Number(JSON.parse(window.localStorage.getItem("currentNode"))) : 0);
    const currentError = writable(undefined);
    const networkManager = writable(new NetworkManager());
    currentError.subscribe(value => {
        if (value != undefined) {
            console.log("Error[id: " + value.id + "] " + value.message);
        }
    });
    currentNode.subscribe(value => {
        window.localStorage.setItem("currentNode", JSON.stringify(value));
    });
    darkMode.subscribe(value => {
        localStorage.setItem("darkMode", JSON.stringify(value));
    });

    /* src\components\top\TopNavigation.svelte generated by Svelte v3.46.3 */
    const file$6 = "src\\components\\top\\TopNavigation.svelte";

    // (30:8) {:else}
    function create_else_block$3(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Moon,
    				class: "top-navigation-icon",
    				size: "24"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(30:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:8) {#if $darkMode}
    function create_if_block$4(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Sun,
    				class: "top-navigation-icon",
    				size: "24"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(28:8) {#if $darkMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let p;
    	let t1;
    	let icon0;
    	let t2;
    	let h5;
    	let t3;
    	let t4;
    	let span;
    	let current_block_type_index;
    	let if_block;
    	let t5;
    	let icon1;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: {
    				src: Hashtag,
    				size: "18",
    				class: "mr-1 ml-1 title-slash"
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$4, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$darkMode*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	icon1 = new Icon({
    			props: {
    				src: UserCircle,
    				size: "24",
    				class: "top-navigation-icon"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "WebControl";
    			t1 = space();
    			create_component(icon0.$$.fragment);
    			t2 = space();
    			h5 = element("h5");
    			t3 = text(/*title*/ ctx[0]);
    			t4 = space();
    			span = element("span");
    			if_block.c();
    			t5 = space();
    			create_component(icon1.$$.fragment);
    			attr_dev(p, "class", "title-text-root");
    			add_location(p, file$6, 23, 4, 614);
    			attr_dev(h5, "class", "title-text");
    			add_location(h5, file$6, 25, 4, 729);
    			add_location(span, file$6, 26, 4, 770);
    			attr_dev(div, "class", "top-navigation");
    			add_location(div, file$6, 22, 0, 580);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(div, t1);
    			mount_component(icon0, div, null);
    			append_dev(div, t2);
    			append_dev(div, h5);
    			append_dev(h5, t3);
    			append_dev(div, t4);
    			append_dev(div, span);
    			if_blocks[current_block_type_index].m(span, null);
    			append_dev(div, t5);
    			mount_component(icon1, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*changeTheme*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t3, /*title*/ ctx[0]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(span, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon0);
    			if_blocks[current_block_type_index].d();
    			destroy_component(icon1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function update(value) {
    	const bodyClass = window.document.body.classList;
    	value ? bodyClass.add("dark") : bodyClass.remove("dark");
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $darkMode;
    	validate_store(darkMode, 'darkMode');
    	component_subscribe($$self, darkMode, $$value => $$invalidate(1, $darkMode = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopNavigation', slots, []);
    	let { title } = $$props;

    	onMount(() => {
    		darkMode.update(value => {
    			update(value);
    			return value;
    		});
    	});

    	function changeTheme() {
    		darkMode.update(value => {
    			update(!value);
    			return !value;
    		});
    	}

    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopNavigation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		Moon,
    		Sun,
    		Hashtag,
    		UserCircle,
    		onMount,
    		darkMode,
    		title,
    		changeTheme,
    		update,
    		$darkMode
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, $darkMode, changeTheme];
    }

    class TopNavigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopNavigation",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<TopNavigation> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<TopNavigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<TopNavigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\HomeContent.svelte generated by Svelte v3.46.3 */
    const file$5 = "src\\components\\HomeContent.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let topnavigation;
    	let t0;
    	let div1;
    	let div0;
    	let h2;
    	let span;
    	let current;
    	topnavigation = new TopNavigation({ props: { title: "Home" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			span = element("span");
    			span.textContent = "Please use the sidebar to navigate in the dashboard";
    			attr_dev(span, "class", "block");
    			add_location(span, file$5, 8, 16, 438);
    			attr_dev(h2, "class", "text-3xl font-extralight tracking-tight text-gray-900 dark:text-white sm:text-4xl");
    			add_location(h2, file$5, 7, 12, 326);
    			attr_dev(div0, "class", "mt-9 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between");
    			add_location(div0, file$5, 6, 8, 197);
    			attr_dev(div1, "class", "content-list");
    			add_location(div1, file$5, 5, 4, 161);
    			attr_dev(div2, "class", "content-container");
    			add_location(div2, file$5, 3, 0, 88);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(topnavigation, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(h2, span);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(topnavigation);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HomeContent', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HomeContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TopNavigation });
    	return [];
    }

    class HomeContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeContent",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\LoadingContent.svelte generated by Svelte v3.46.3 */
    const file$4 = "src\\components\\LoadingContent.svelte";

    function create_fragment$4(ctx) {
    	let div7;
    	let topnavigation;
    	let t0;
    	let div6;
    	let div5;
    	let div4;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let current;
    	topnavigation = new TopNavigation({ props: { title: "Home" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			add_location(div0, file$4, 8, 16, 370);
    			add_location(div1, file$4, 9, 16, 399);
    			add_location(div2, file$4, 10, 16, 428);
    			add_location(div3, file$4, 11, 16, 457);
    			attr_dev(div4, "class", "lds-ellipsis");
    			add_location(div4, file$4, 7, 12, 326);
    			attr_dev(div5, "class", "mt-9 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between");
    			add_location(div5, file$4, 6, 8, 197);
    			attr_dev(div6, "class", "content-list");
    			add_location(div6, file$4, 5, 4, 161);
    			attr_dev(div7, "class", "content-container");
    			add_location(div7, file$4, 3, 0, 88);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			mount_component(topnavigation, div7, null);
    			append_dev(div7, t0);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(topnavigation);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingContent', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TopNavigation });
    	return [];
    }

    class LoadingContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingContent",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\LoginContent.svelte generated by Svelte v3.46.3 */
    const file$3 = "src\\components\\LoginContent.svelte";

    // (69:32) {:else}
    function create_else_block$2(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: LockClosed,
    				size: "19",
    				class: "h-5 w-5 text-indigo-500 group-hover:text-indigo-400",
    				"aria-hidden": "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(69:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:32) {#if siteState}
    function create_if_block$3(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				size: "19",
    				class: "h-5 w-5 text-indigo-500 group-hover:text-indigo-400 service-button-loading",
    				"aria-hidden": "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(67:32) {#if siteState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div11;
    	let topnavigation;
    	let t0;
    	let div10;
    	let div9;
    	let div8;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let h2;
    	let t3;
    	let p;
    	let t4;
    	let t5_value = ' ' + "";
    	let t5;
    	let span0;
    	let t7;
    	let form;
    	let input0;
    	let t8;
    	let div3;
    	let div1;
    	let input1;
    	let t9;
    	let div2;
    	let input2;
    	let t10;
    	let div6;
    	let div4;
    	let input3;
    	let t11;
    	let label;
    	let t13;
    	let div5;
    	let span1;
    	let t15;
    	let div7;
    	let button;
    	let span2;
    	let current_block_type_index;
    	let if_block;
    	let t16;
    	let t17;
    	let current;
    	let mounted;
    	let dispose;

    	topnavigation = new TopNavigation({
    			props: { title: "Login" },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*siteState*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Login to your account";
    			t3 = space();
    			p = element("p");
    			t4 = text("Or");
    			t5 = text(t5_value);
    			span0 = element("span");
    			span0.textContent = "create one";
    			t7 = space();
    			form = element("form");
    			input0 = element("input");
    			t8 = space();
    			div3 = element("div");
    			div1 = element("div");
    			input1 = element("input");
    			t9 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t10 = space();
    			div6 = element("div");
    			div4 = element("div");
    			input3 = element("input");
    			t11 = space();
    			label = element("label");
    			label.textContent = "Remember me";
    			t13 = space();
    			div5 = element("div");
    			span1 = element("span");
    			span1.textContent = "Forgot your password?";
    			t15 = space();
    			div7 = element("div");
    			button = element("button");
    			span2 = element("span");
    			if_block.c();
    			t16 = space();
    			t17 = text("Login");
    			attr_dev(img, "class", "mx-auto h-24 w-24");
    			if (!src_url_equal(img.src, img_src_value = "/images/logo512.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Workflow");
    			add_location(img, file$3, 25, 20, 867);
    			attr_dev(h2, "class", "text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300");
    			add_location(h2, file$3, 26, 20, 962);
    			attr_dev(span0, "class", "cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500");
    			add_location(span0, file$3, 27, 96, 1167);
    			attr_dev(p, "class", "mt-2 text-center text-sm text-gray-600 dark:text-gray-400");
    			add_location(p, file$3, 27, 20, 1091);
    			add_location(div0, file$3, 24, 16, 840);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "remember");
    			attr_dev(input0, "defaultvalue", "true");
    			add_location(input0, file$3, 40, 20, 1901);
    			attr_dev(input1, "id", "loginUsernameInput");
    			attr_dev(input1, "name", "loginUsernameInput");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "autocomplete", "text");
    			input1.required = true;
    			attr_dev(input1, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input1, "placeholder", "Username");
    			add_location(input1, file$3, 43, 28, 2089);
    			add_location(div1, file$3, 42, 24, 2054);
    			attr_dev(input2, "id", "loginPasswordInput");
    			attr_dev(input2, "name", "loginPasswordInput");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "autocomplete", "current-password");
    			input2.required = true;
    			attr_dev(input2, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input2, "placeholder", "Password");
    			add_location(input2, file$3, 46, 28, 2628);
    			add_location(div2, file$3, 45, 24, 2593);
    			attr_dev(div3, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div3, file$3, 41, 20, 1982);
    			attr_dev(input3, "id", "remember-me");
    			attr_dev(input3, "name", "remember-me");
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "class", "h-4 w-4 text-indigo-600 bg-white dark:bg-gray-500 focus:ring-indigo-500 border-gray-300 rounded");
    			add_location(input3, file$3, 52, 28, 3308);
    			attr_dev(label, "for", "remember-me");
    			attr_dev(label, "class", "ml-2 block text-sm dark:text-gray-300 text-gray-500");
    			add_location(label, file$3, 53, 28, 3502);
    			attr_dev(div4, "class", "flex items-center");
    			add_location(div4, file$3, 51, 24, 3247);
    			attr_dev(span1, "class", "cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500");
    			add_location(span1, file$3, 59, 28, 3781);
    			attr_dev(div5, "class", "text-sm");
    			add_location(div5, file$3, 58, 24, 3730);
    			attr_dev(div6, "class", "flex items-center justify-between");
    			add_location(div6, file$3, 50, 20, 3174);
    			attr_dev(span2, "class", "absolute left-0 inset-y-0 flex items-center pl-3");
    			add_location(span2, file$3, 65, 28, 4312);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$3, 64, 24, 4024);
    			add_location(div7, file$3, 63, 20, 3993);
    			attr_dev(form, "class", "mt-8 space-y-6");
    			attr_dev(form, "action", "#");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$3, 31, 16, 1428);
    			attr_dev(div8, "class", "max-w-md w-full space-y-8");
    			add_location(div8, file$3, 23, 12, 783);
    			attr_dev(div9, "class", "mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8");
    			add_location(div9, file$3, 22, 8, 704);
    			attr_dev(div10, "class", "content-list");
    			add_location(div10, file$3, 21, 4, 668);
    			attr_dev(div11, "class", "content-container");
    			add_location(div11, file$3, 19, 0, 593);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			mount_component(topnavigation, div11, null);
    			append_dev(div11, t0);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div0, img);
    			append_dev(div0, t1);
    			append_dev(div0, h2);
    			append_dev(div0, t3);
    			append_dev(div0, p);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, span0);
    			append_dev(div8, t7);
    			append_dev(div8, form);
    			append_dev(form, input0);
    			append_dev(form, t8);
    			append_dev(form, div3);
    			append_dev(div3, div1);
    			append_dev(div1, input1);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, input2);
    			append_dev(form, t10);
    			append_dev(form, div6);
    			append_dev(div6, div4);
    			append_dev(div4, input3);
    			append_dev(div4, t11);
    			append_dev(div4, label);
    			append_dev(div6, t13);
    			append_dev(div6, div5);
    			append_dev(div5, span1);
    			append_dev(form, t15);
    			append_dev(form, div7);
    			append_dev(div7, button);
    			append_dev(button, span2);
    			if_blocks[current_block_type_index].m(span2, null);
    			append_dev(span2, t16);
    			append_dev(button, t17);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(form, "submit", /*submit_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(span2, t16);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			destroy_component(topnavigation);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoginContent', slots, []);

    	onMount(() => {
    		currentError.subscribe(value => {
    			if (value != undefined) {
    				if (value.id == ErrorIds.create_session) {
    					$$invalidate(2, siteState = false);
    				}
    			}
    		});
    	});

    	let { submitCallback } = $$props;
    	let { changeToRegisterCallback } = $$props;
    	let siteState = false;
    	const writable_props = ['submitCallback', 'changeToRegisterCallback'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoginContent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		changeToRegisterCallback();
    	};

    	const submit_handler = function (event) {
    		event.preventDefault();

    		if (!siteState) {
    			submitCallback(document.getElementById("loginUsernameInput").value, document.getElementById("loginPasswordInput").value, document.getElementById("remember-me").checked);
    			$$invalidate(2, siteState = true);
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('submitCallback' in $$props) $$invalidate(0, submitCallback = $$props.submitCallback);
    		if ('changeToRegisterCallback' in $$props) $$invalidate(1, changeToRegisterCallback = $$props.changeToRegisterCallback);
    	};

    	$$self.$capture_state = () => ({
    		TopNavigation,
    		Icon,
    		LockClosed,
    		Refresh,
    		onMount,
    		currentError,
    		ErrorIds,
    		submitCallback,
    		changeToRegisterCallback,
    		siteState
    	});

    	$$self.$inject_state = $$props => {
    		if ('submitCallback' in $$props) $$invalidate(0, submitCallback = $$props.submitCallback);
    		if ('changeToRegisterCallback' in $$props) $$invalidate(1, changeToRegisterCallback = $$props.changeToRegisterCallback);
    		if ('siteState' in $$props) $$invalidate(2, siteState = $$props.siteState);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		submitCallback,
    		changeToRegisterCallback,
    		siteState,
    		click_handler,
    		submit_handler
    	];
    }

    class LoginContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			submitCallback: 0,
    			changeToRegisterCallback: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoginContent",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*submitCallback*/ ctx[0] === undefined && !('submitCallback' in props)) {
    			console.warn("<LoginContent> was created without expected prop 'submitCallback'");
    		}

    		if (/*changeToRegisterCallback*/ ctx[1] === undefined && !('changeToRegisterCallback' in props)) {
    			console.warn("<LoginContent> was created without expected prop 'changeToRegisterCallback'");
    		}
    	}

    	get submitCallback() {
    		throw new Error("<LoginContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set submitCallback(value) {
    		throw new Error("<LoginContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get changeToRegisterCallback() {
    		throw new Error("<LoginContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changeToRegisterCallback(value) {
    		throw new Error("<LoginContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\AddNodeContent.svelte generated by Svelte v3.46.3 */
    const file$2 = "src\\components\\AddNodeContent.svelte";

    // (54:32) {:else}
    function create_else_block$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: LockClosed,
    				size: "19",
    				class: "h-5 w-5 text-indigo-500 group-hover:text-indigo-400",
    				"aria-hidden": "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(54:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:32) {#if siteState}
    function create_if_block$2(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				size: "19",
    				class: "h-5 w-5 text-indigo-500 group-hover:text-indigo-400 service-button-loading",
    				"aria-hidden": "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(52:32) {#if siteState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div8;
    	let topnavigation;
    	let t0;
    	let div7;
    	let div6;
    	let div5;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let h2;
    	let t3;
    	let p;
    	let t5;
    	let form;
    	let input0;
    	let t6;
    	let div3;
    	let div1;
    	let input1;
    	let t7;
    	let div2;
    	let input2;
    	let t8;
    	let div4;
    	let button;
    	let span;
    	let current_block_type_index;
    	let if_block;
    	let t9;
    	let t10;
    	let current;
    	let mounted;
    	let dispose;
    	topnavigation = new TopNavigation({ props: { title: "Node" }, $$inline: true });
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*siteState*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Add Node";
    			t3 = space();
    			p = element("p");
    			p.textContent = "The note is needed to be able to set up the login and the services.";
    			t5 = space();
    			form = element("form");
    			input0 = element("input");
    			t6 = space();
    			div3 = element("div");
    			div1 = element("div");
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t8 = space();
    			div4 = element("div");
    			button = element("button");
    			span = element("span");
    			if_block.c();
    			t9 = space();
    			t10 = text("Connect");
    			attr_dev(img, "class", "mx-auto h-24 w-24");
    			if (!src_url_equal(img.src, img_src_value = "/images/logo512.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Workflow");
    			add_location(img, file$2, 24, 20, 826);
    			attr_dev(h2, "class", "text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300");
    			add_location(h2, file$2, 25, 20, 921);
    			attr_dev(p, "class", "mt-2 text-center text-sm text-gray-600 dark:text-gray-400");
    			add_location(p, file$2, 26, 20, 1037);
    			add_location(div0, file$2, 23, 16, 799);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "remember");
    			attr_dev(input0, "defaultvalue", "true");
    			add_location(input0, file$2, 39, 20, 1691);
    			attr_dev(input1, "id", "nodeServerAddressInput");
    			attr_dev(input1, "name", "nodeServerAddressInput");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "autocomplete", "text");
    			input1.required = true;
    			attr_dev(input1, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input1, "placeholder", "Server address");
    			add_location(input1, file$2, 42, 28, 1879);
    			add_location(div1, file$2, 41, 24, 1844);
    			attr_dev(input2, "id", "nodePortInput");
    			attr_dev(input2, "name", "nodePortInput");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "autocomplete", "port");
    			input2.required = true;
    			attr_dev(input2, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input2, "placeholder", "Port");
    			add_location(input2, file$2, 45, 28, 2432);
    			add_location(div2, file$2, 44, 24, 2397);
    			attr_dev(div3, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div3, file$2, 40, 20, 1772);
    			attr_dev(span, "class", "absolute left-0 inset-y-0 flex items-center pl-3");
    			add_location(span, file$2, 50, 28, 3267);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$2, 49, 24, 2979);
    			add_location(div4, file$2, 48, 20, 2948);
    			attr_dev(form, "class", "mt-8 space-y-6");
    			attr_dev(form, "action", "#");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$2, 30, 16, 1267);
    			attr_dev(div5, "class", "max-w-md w-full space-y-8");
    			add_location(div5, file$2, 22, 12, 742);
    			attr_dev(div6, "class", "mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8");
    			add_location(div6, file$2, 21, 8, 663);
    			attr_dev(div7, "class", "content-list");
    			add_location(div7, file$2, 20, 4, 627);
    			attr_dev(div8, "class", "content-container");
    			add_location(div8, file$2, 18, 0, 553);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			mount_component(topnavigation, div8, null);
    			append_dev(div8, t0);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div0, img);
    			append_dev(div0, t1);
    			append_dev(div0, h2);
    			append_dev(div0, t3);
    			append_dev(div0, p);
    			append_dev(div5, t5);
    			append_dev(div5, form);
    			append_dev(form, input0);
    			append_dev(form, t6);
    			append_dev(form, div3);
    			append_dev(div3, div1);
    			append_dev(div1, input1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, input2);
    			append_dev(form, t8);
    			append_dev(form, div4);
    			append_dev(div4, button);
    			append_dev(button, span);
    			if_blocks[current_block_type_index].m(span, null);
    			append_dev(span, t9);
    			append_dev(button, t10);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*submit_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(span, t9);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_component(topnavigation);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddNodeContent', slots, []);

    	onMount(() => {
    		currentError.subscribe(value => {
    			if (value != undefined) {
    				if (value.id == ErrorIds.node_connect) {
    					$$invalidate(1, siteState = false);
    				}
    			}
    		});
    	});

    	let { submitCallback } = $$props;
    	let siteState = false;
    	const writable_props = ['submitCallback'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddNodeContent> was created with unknown prop '${key}'`);
    	});

    	const submit_handler = function (event) {
    		event.preventDefault();

    		if (!siteState) {
    			submitCallback(document.getElementById("nodeServerAddressInput").value, document.getElementById("nodePortInput").value);
    			$$invalidate(1, siteState = true);
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('submitCallback' in $$props) $$invalidate(0, submitCallback = $$props.submitCallback);
    	};

    	$$self.$capture_state = () => ({
    		TopNavigation,
    		Icon,
    		Refresh,
    		LockClosed,
    		onMount,
    		currentError,
    		ErrorIds,
    		submitCallback,
    		siteState
    	});

    	$$self.$inject_state = $$props => {
    		if ('submitCallback' in $$props) $$invalidate(0, submitCallback = $$props.submitCallback);
    		if ('siteState' in $$props) $$invalidate(1, siteState = $$props.siteState);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [submitCallback, siteState, submit_handler];
    }

    class AddNodeContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { submitCallback: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddNodeContent",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*submitCallback*/ ctx[0] === undefined && !('submitCallback' in props)) {
    			console.warn("<AddNodeContent> was created without expected prop 'submitCallback'");
    		}
    	}

    	get submitCallback() {
    		throw new Error("<AddNodeContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set submitCallback(value) {
    		throw new Error("<AddNodeContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\RegisterContent.svelte generated by Svelte v3.46.3 */
    const file$1 = "src\\components\\RegisterContent.svelte";

    // (72:32) {:else}
    function create_else_block(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: LockClosed,
    				size: "19",
    				class: "h-5 w-5 text-indigo-500 group-hover:text-indigo-400",
    				"aria-hidden": "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(72:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (70:32) {#if siteState}
    function create_if_block$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				size: "19",
    				class: "h-5 w-5 text-indigo-500 group-hover:text-indigo-400 service-button-loading",
    				"aria-hidden": "true"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(70:32) {#if siteState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div10;
    	let topnavigation;
    	let t0;
    	let div9;
    	let div8;
    	let div7;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let h2;
    	let t3;
    	let p;
    	let t4;
    	let t5_value = ' ' + "";
    	let t5;
    	let span0;
    	let t7;
    	let form;
    	let div1;
    	let input0;
    	let t8;
    	let div5;
    	let div2;
    	let input1;
    	let t9;
    	let div3;
    	let input2;
    	let t10;
    	let div4;
    	let input3;
    	let t11;
    	let div6;
    	let button;
    	let span1;
    	let current_block_type_index;
    	let if_block;
    	let t12;
    	let t13;
    	let current;
    	let mounted;
    	let dispose;

    	topnavigation = new TopNavigation({
    			props: { title: "Create Account" },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*siteState*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Create your account";
    			t3 = space();
    			p = element("p");
    			t4 = text("Or");
    			t5 = text(t5_value);
    			span0 = element("span");
    			span0.textContent = "login";
    			t7 = space();
    			form = element("form");
    			div1 = element("div");
    			input0 = element("input");
    			t8 = space();
    			div5 = element("div");
    			div2 = element("div");
    			input1 = element("input");
    			t9 = space();
    			div3 = element("div");
    			input2 = element("input");
    			t10 = space();
    			div4 = element("div");
    			input3 = element("input");
    			t11 = space();
    			div6 = element("div");
    			button = element("button");
    			span1 = element("span");
    			if_block.c();
    			t12 = space();
    			t13 = text("Register");
    			attr_dev(img, "class", "mx-auto h-24 w-24");
    			if (!src_url_equal(img.src, img_src_value = "/images/logo512.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Workflow");
    			add_location(img, file$1, 26, 20, 933);
    			attr_dev(h2, "class", "text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300");
    			add_location(h2, file$1, 27, 20, 1028);
    			attr_dev(span0, "class", "cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500");
    			add_location(span0, file$1, 28, 96, 1231);
    			attr_dev(p, "class", "mt-2 text-center text-sm text-gray-600 dark:text-gray-400");
    			add_location(p, file$1, 28, 20, 1155);
    			add_location(div0, file$1, 25, 16, 906);
    			attr_dev(input0, "id", "createTokenInput");
    			attr_dev(input0, "name", "createTokenInput");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "autocomplete", "text");
    			input0.required = true;
    			attr_dev(input0, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input0, "placeholder", "Token");
    			add_location(input0, file$1, 51, 24, 2541);
    			attr_dev(div1, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div1, file$1, 50, 20, 2469);
    			attr_dev(input1, "id", "createUsernameInput");
    			attr_dev(input1, "name", "createUsernameInput");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "autocomplete", "text");
    			input1.required = true;
    			attr_dev(input1, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input1, "placeholder", "Username");
    			add_location(input1, file$1, 56, 28, 3139);
    			add_location(div2, file$1, 55, 24, 3104);
    			attr_dev(input2, "id", "createPasswordInput");
    			attr_dev(input2, "name", "createPasswordInput");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "autocomplete", "current-password");
    			input2.required = true;
    			attr_dev(input2, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input2, "placeholder", "Password");
    			add_location(input2, file$1, 59, 28, 3680);
    			add_location(div3, file$1, 58, 24, 3645);
    			attr_dev(input3, "id", "createPasswordConfirmInput");
    			attr_dev(input3, "name", "createPasswordConfirmInput");
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "autocomplete", "current-password");
    			input3.required = true;
    			attr_dev(input3, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input3, "placeholder", "Confirm Password");
    			add_location(input3, file$1, 62, 28, 4237);
    			add_location(div4, file$1, 61, 24, 4202);
    			attr_dev(div5, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div5, file$1, 54, 20, 3032);
    			attr_dev(span1, "class", "absolute left-0 inset-y-0 flex items-center pl-3");
    			add_location(span1, file$1, 68, 28, 5126);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$1, 67, 24, 4838);
    			add_location(div6, file$1, 66, 20, 4807);
    			attr_dev(form, "class", "mt-8 space-y-6");
    			attr_dev(form, "action", "#");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$1, 32, 16, 1484);
    			attr_dev(div7, "class", "max-w-md w-full space-y-8");
    			add_location(div7, file$1, 24, 12, 849);
    			attr_dev(div8, "class", "mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8");
    			add_location(div8, file$1, 23, 8, 770);
    			attr_dev(div9, "class", "content-list");
    			add_location(div9, file$1, 22, 4, 734);
    			attr_dev(div10, "class", "content-container");
    			add_location(div10, file$1, 20, 0, 650);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			mount_component(topnavigation, div10, null);
    			append_dev(div10, t0);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div0);
    			append_dev(div0, img);
    			append_dev(div0, t1);
    			append_dev(div0, h2);
    			append_dev(div0, t3);
    			append_dev(div0, p);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, span0);
    			append_dev(div7, t7);
    			append_dev(div7, form);
    			append_dev(form, div1);
    			append_dev(div1, input0);
    			append_dev(form, t8);
    			append_dev(form, div5);
    			append_dev(div5, div2);
    			append_dev(div2, input1);
    			append_dev(div5, t9);
    			append_dev(div5, div3);
    			append_dev(div3, input2);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, input3);
    			append_dev(form, t11);
    			append_dev(form, div6);
    			append_dev(div6, button);
    			append_dev(button, span1);
    			if_blocks[current_block_type_index].m(span1, null);
    			append_dev(span1, t12);
    			append_dev(button, t13);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(form, "submit", /*submit_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(span1, t12);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(topnavigation);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RegisterContent', slots, []);

    	onMount(() => {
    		currentError.subscribe(value => {
    			if (value != undefined) {
    				if (value.id == ErrorIds.create_account) {
    					$$invalidate(2, siteState = false);
    				}
    			}
    		});
    	});

    	let { submitCallback } = $$props;
    	let { changeToLoginCallback } = $$props;
    	let siteState = false;
    	const writable_props = ['submitCallback', 'changeToLoginCallback'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RegisterContent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		changeToLoginCallback();
    	};

    	const submit_handler = function (event) {
    		event.preventDefault();

    		if (!siteState) {
    			let password = document.getElementById("createPasswordInput").value;
    			let password2 = document.getElementById("createPasswordConfirmInput").value;

    			if (password === password2) {
    				let token = document.getElementById("createTokenInput").value;
    				let username = document.getElementById("createUsernameInput").value;
    				submitCallback(username, password, token);
    				$$invalidate(2, siteState = true);
    			} else {
    				currentError.set(new ApplicationError(ErrorIds.create_account, "Your passwords are not the same"));
    			}
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('submitCallback' in $$props) $$invalidate(0, submitCallback = $$props.submitCallback);
    		if ('changeToLoginCallback' in $$props) $$invalidate(1, changeToLoginCallback = $$props.changeToLoginCallback);
    	};

    	$$self.$capture_state = () => ({
    		TopNavigation,
    		Icon,
    		LockClosed,
    		Refresh,
    		currentError,
    		ApplicationError,
    		ErrorIds,
    		onMount,
    		submitCallback,
    		changeToLoginCallback,
    		siteState
    	});

    	$$self.$inject_state = $$props => {
    		if ('submitCallback' in $$props) $$invalidate(0, submitCallback = $$props.submitCallback);
    		if ('changeToLoginCallback' in $$props) $$invalidate(1, changeToLoginCallback = $$props.changeToLoginCallback);
    		if ('siteState' in $$props) $$invalidate(2, siteState = $$props.siteState);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		submitCallback,
    		changeToLoginCallback,
    		siteState,
    		click_handler,
    		submit_handler
    	];
    }

    class RegisterContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			submitCallback: 0,
    			changeToLoginCallback: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RegisterContent",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*submitCallback*/ ctx[0] === undefined && !('submitCallback' in props)) {
    			console.warn("<RegisterContent> was created without expected prop 'submitCallback'");
    		}

    		if (/*changeToLoginCallback*/ ctx[1] === undefined && !('changeToLoginCallback' in props)) {
    			console.warn("<RegisterContent> was created without expected prop 'changeToLoginCallback'");
    		}
    	}

    	get submitCallback() {
    		throw new Error("<RegisterContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set submitCallback(value) {
    		throw new Error("<RegisterContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get changeToLoginCallback() {
    		throw new Error("<RegisterContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changeToLoginCallback(value) {
    		throw new Error("<RegisterContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const PageIds = {
        register: -4,
        login: -3,
        addNode: -2,
        loading: -1,
        home: 0,
        application: 1,
        options: 2,
        console: 3,
        files: 4,
        access: 5,
        settings: 6
    };

    /* src\App.svelte generated by Svelte v3.46.3 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (132:41) 
    function create_if_block_4(ctx) {
    	let addnodecontent;
    	let current;

    	addnodecontent = new AddNodeContent({
    			props: { submitCallback: /*addNode*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(addnodecontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addnodecontent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addnodecontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addnodecontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addnodecontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(132:41) ",
    		ctx
    	});

    	return block;
    }

    // (130:42) 
    function create_if_block_3(ctx) {
    	let registercontent;
    	let current;

    	registercontent = new RegisterContent({
    			props: {
    				changeToLoginCallback: /*func_1*/ ctx[6],
    				submitCallback: /*createAccount*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(registercontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(registercontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const registercontent_changes = {};
    			if (dirty & /*sideId*/ 1) registercontent_changes.changeToLoginCallback = /*func_1*/ ctx[6];
    			registercontent.$set(registercontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(registercontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(registercontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(registercontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(130:42) ",
    		ctx
    	});

    	return block;
    }

    // (128:39) 
    function create_if_block_2(ctx) {
    	let logincontent;
    	let current;

    	logincontent = new LoginContent({
    			props: {
    				changeToRegisterCallback: /*func*/ ctx[5],
    				submitCallback: /*requestLogin*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(logincontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(logincontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const logincontent_changes = {};
    			if (dirty & /*sideId*/ 1) logincontent_changes.changeToRegisterCallback = /*func*/ ctx[5];
    			logincontent.$set(logincontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logincontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logincontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logincontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(128:39) ",
    		ctx
    	});

    	return block;
    }

    // (126:41) 
    function create_if_block_1(ctx) {
    	let loadingcontent;
    	let current;
    	loadingcontent = new LoadingContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingcontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingcontent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingcontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(126:41) ",
    		ctx
    	});

    	return block;
    }

    // (124:4) {#if sideId === PageIds.home}
    function create_if_block(ctx) {
    	let homecontent;
    	let current;
    	homecontent = new HomeContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(homecontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(homecontent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(homecontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(homecontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(homecontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(124:4) {#if sideId === PageIds.home}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let sidebar;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	sidebar = new SideBar({
    			props: { hideIcon: /*hideSideBarIcon*/ ctx[1] },
    			$$inline: true
    		});

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*sideId*/ ctx[0] === PageIds.home) return 0;
    		if (/*sideId*/ ctx[0] === PageIds.loading) return 1;
    		if (/*sideId*/ ctx[0] === PageIds.login) return 2;
    		if (/*sideId*/ ctx[0] === PageIds.register) return 3;
    		if (/*sideId*/ ctx[0] === PageIds.addNode) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(sidebar.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(main, "class", "flex");
    			add_location(main, file, 121, 0, 4652);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(sidebar, main, null);
    			append_dev(main, t);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sidebar_changes = {};
    			if (dirty & /*hideSideBarIcon*/ 2) sidebar_changes.hideIcon = /*hideSideBarIcon*/ ctx[1];
    			sidebar.$set(sidebar_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(sidebar);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let sideId = PageIds.loading;
    	let hideSideBarIcon = [1, 2, 3, 4, 5, 6, 7, 8];

    	networkManager.update(value => {
    		value.prepareManager();

    		if (value.nodeManager.nodes.length <= 0) {
    			$$invalidate(0, sideId = PageIds.addNode);
    		} else {
    			currentNode.update(nodeId => {
    				connectToNode();
    				return nodeId;
    			});
    		}

    		return value;
    	});

    	function connectToNode() {
    		$$invalidate(0, sideId = PageIds.loading);

    		networkManager.update(manager => {
    			manager.nodeManager.connect((result, node) => {
    				if (result == 1) {
    					if (node.hasUser()) {
    						sendClientLoginRequest();
    					} else {
    						$$invalidate(0, sideId = PageIds.login);
    					}
    				}
    			});

    			return manager;
    		});
    	}

    	function sendClientLoginRequest() {
    		$$invalidate(0, sideId = PageIds.loading);

    		networkManager.update(value => {
    			currentNode.update(nodeId => {
    				let node = value.nodeManager.getNodeById(nodeId);

    				node.requestLogin().then(result => {
    					if (result == 1) {
    						$$invalidate(0, sideId = PageIds.home);
    						$$invalidate(1, hideSideBarIcon = []);

    						// TODO: Load applications and currentApplication
    						node.requestUserData().then(result => {
    							
    						});
    					} else if (result == 0) {
    						node.user.delete();
    						currentError.set(new ApplicationError(ErrorIds.session_outdated, "Your session is out of date or has errors, please log in again."));
    						$$invalidate(0, sideId = PageIds.login);
    					} else {
    						$$invalidate(0, sideId = PageIds.login);
    					}
    				});

    				return nodeId;
    			});

    			return value;
    		});
    	}

    	function requestLogin(username, password, checked) {
    		console.log("Trying to create login session for user[" + username + "].");

    		networkManager.update(value => {
    			currentNode.update(nodeId => {
    				let node = value.nodeManager.getNodeById(nodeId);

    				node.requestLoginSession(username, password, checked).then(result => {
    					if (result == undefined) {
    						currentError.set(new ApplicationError(ErrorIds.create_session, "Password or username is wrong"));
    					} else {
    						node.saveUser(username, result);
    						sendClientLoginRequest();
    					}
    				});

    				return nodeId;
    			});

    			return value;
    		});
    	}

    	function createAccount(username, password, token) {
    		console.log("Trying to create account with username[" + username + "]");

    		networkManager.update(value => {
    			currentNode.update(nodeId => {
    				let node = value.nodeManager.getNodeById(nodeId);

    				node.createAccount(username, password, token).then(result => {
    					if (result == 1) {
    						$$invalidate(0, sideId = PageIds.login);
    					} else if (result == 0) {
    						currentError.set(new ApplicationError(ErrorIds.create_account, "The token is wrong or a user with the username[" + username + "] already exists"));
    					}
    				});

    				return nodeId;
    			});

    			return value;
    		});
    	}

    	function addNode(host, port) {
    		console.log("Trying to connect to node[" + host + ":" + port + "]");

    		networkManager.update(value => {
    			value.nodeManager.testNode(
    				host,
    				port,
    				() => {
    					let id = value.nodeManager.addNode(host, port);
    					currentNode.set(id);
    					connectToNode();
    				},
    				() => {
    					currentError.set(new ApplicationError(ErrorIds.node_connect, "Error while connecting to the node[" + host + ":" + port + "]"));
    				}
    			);

    			return value;
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func = function () {
    		$$invalidate(0, sideId = PageIds.register);
    	};

    	const func_1 = function () {
    		$$invalidate(0, sideId = PageIds.login);
    	};

    	$$self.$capture_state = () => ({
    		SideBar,
    		HomeContent,
    		LoadingContent,
    		LoginContent,
    		AddNodeContent,
    		RegisterContent,
    		PageIds,
    		ApplicationError,
    		currentError,
    		currentNode,
    		networkManager,
    		ErrorIds,
    		sideId,
    		hideSideBarIcon,
    		connectToNode,
    		sendClientLoginRequest,
    		requestLogin,
    		createAccount,
    		addNode
    	});

    	$$self.$inject_state = $$props => {
    		if ('sideId' in $$props) $$invalidate(0, sideId = $$props.sideId);
    		if ('hideSideBarIcon' in $$props) $$invalidate(1, hideSideBarIcon = $$props.hideSideBarIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sideId, hideSideBarIcon, requestLogin, createAccount, addNode, func, func_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
