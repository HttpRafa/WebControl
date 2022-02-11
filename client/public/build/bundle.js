
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
                update$2(component.$$);
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
    function update$2($$) {
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

    var Check = [[{"fill-rule":"evenodd","d":"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M5 13l4 4L19 7"}]];

    var Chip = [[{"d":"M13 7H7v6h6V7z"},{"fill-rule":"evenodd","d":"M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"}]];

    var Cloud = [[{"d":"M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"}]];

    var Database = [[{"d":"M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"},{"d":"M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"},{"d":"M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"}]];

    var DesktopComputer = [[{"fill-rule":"evenodd","d":"M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"}]];

    var DocumentDuplicate = [[{"d":"M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z"},{"d":"M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"}]];

    var FingerPrint = [[{"fill-rule":"evenodd","d":"M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z","clip-rule":"evenodd"},{"fill-rule":"evenodd","d":"M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z","clip-rule":"evenodd"},{"fill-rule":"evenodd","d":"M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"}]];

    var Folder = [[{"d":"M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"}]];

    var Hashtag = [[{"fill-rule":"evenodd","d":"M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M7 20l4-16m2 16l4-16M6 9h14M4 15h14"}]];

    var Home = [[{"d":"M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"}]];

    var Key = [[{"fill-rule":"evenodd","d":"M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"}]];

    var LockClosed = [[{"fill-rule":"evenodd","d":"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"}]];

    var Moon = [[{"d":"M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"}]];

    var Pencil = [[{"d":"M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"}]];

    var Play = [[{"fill-rule":"evenodd","d":"M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"},{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}]];

    var Plus = [[{"fill-rule":"evenodd","d":"M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 4v16m8-8H4"}]];

    var Refresh = [[{"fill-rule":"evenodd","d":"M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"}]];

    var Save = [[{"d":"M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"}]];

    var Server = [[{"fill-rule":"evenodd","d":"M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"}]];

    var Stop = [[{"fill-rule":"evenodd","d":"M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M21 12a9 9 0 11-18 0 9 9 0 0118 0z"},{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"}]];

    var Sun = [[{"fill-rule":"evenodd","d":"M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"}]];

    var Terminal = [[{"fill-rule":"evenodd","d":"M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"}]];

    var Trash = [[{"fill-rule":"evenodd","d":"M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"}]];

    var UserCircle = [[{"fill-rule":"evenodd","d":"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z","clip-rule":"evenodd"}],[{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"}]];

    /* node_modules\svelte-hero-icons\Icon.svelte generated by Svelte v3.46.3 */

    const file$g = "node_modules\\svelte-hero-icons\\Icon.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (22:0) {#if src && src != []}
    function create_if_block$a(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*solid*/ ctx[2]) return create_if_block_1$4;
    		return create_else_block$8;
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
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(22:0) {#if src && src != []}",
    		ctx
    	});

    	return block;
    }

    // (38:2) {:else}
    function create_else_block$8(ctx) {
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
    			add_location(svg, file$g, 38, 4, 765);
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
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(38:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if solid}
    function create_if_block_1$4(ctx) {
    	let svg;
    	let each_value = /*src*/ ctx[1][0] ?? [];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
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
    			add_location(svg, file$g, 23, 4, 446);
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
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_if_block_1$4.name,
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
    			add_location(path, file$g, 50, 8, 1047);
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
    function create_each_block$4(ctx) {
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
    			add_location(path, file$g, 34, 8, 708);
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(33:6) {#each src[0] ?? [] as att}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let if_block_anchor;
    	let if_block = /*src*/ ctx[1] && /*src*/ ctx[1] != [] && create_if_block$a(ctx);

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
    					if_block = create_if_block$a(ctx);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { src: 1, size: 0, solid: 2, class: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$g.name
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
    const file$f = "src\\components\\sidebar\\SideBarIcon.svelte";

    function create_fragment$f(ctx) {
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
    			add_location(span, file$f, 7, 4, 185);
    			attr_dev(div, "class", "sidebar-icon group");
    			add_location(div, file$f, 5, 0, 110);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { icon: 0, text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBarIcon",
    			options,
    			id: create_fragment$f.name
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

    const file$e = "src\\components\\sidebar\\SideBarDivider.svelte";

    // (6:0) {:else}
    function create_else_block$7(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			attr_dev(hr, "class", "sidebar-hr");
    			add_location(hr, file$e, 6, 4, 112);
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
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(6:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (4:0) {#if hide}
    function create_if_block$9(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			attr_dev(hr, "class", "hidden sidebar-hr");
    			add_location(hr, file$e, 4, 4, 65);
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
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(4:0) {#if hide}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*hide*/ ctx[0]) return create_if_block$9;
    		return create_else_block$7;
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { hide: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBarDivider",
    			options,
    			id: create_fragment$e.name
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
            if (data.id === 5) {
                // @ts-ignore
                if (data.document.data.applicationState != undefined) {
                    // @ts-ignore
                    applicationState.set(data.document.data.applicationState);
                }
                // @ts-ignore
                if (data.document.data.applicationType != undefined) {
                    // @ts-ignore
                    applicationType.set(data.document.data.applicationType);
                }
                // @ts-ignore
                if (data.document.data.applicationUptime != undefined) {
                    // @ts-ignore
                    applicationUptime.set(data.document.data.applicationUptime);
                }
                // @ts-ignore
                if (data.document.data.applicationCpuLoad != undefined) {
                    // @ts-ignore
                    applicationCpuLoad.set(data.document.data.applicationCpuLoad);
                }
                // @ts-ignore
                if (data.document.data.applicationMemoryUsage != undefined) {
                    // @ts-ignore
                    applicationMemoryUsage.set(data.document.data.applicationMemoryUsage);
                }
                // @ts-ignore
                if (data.document.data.applicationDescription != undefined) {
                    // @ts-ignore
                    applicationDescription.set(data.document.data.applicationDescription);
                }
            }
            else {
                for (let i = 0; i < this._packetHandler.length; i++) {
                    this._packetHandler[i](data);
                }
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
        create_account: -4,
        user_data_request: -5,
        request: -6,
    };

    class PacketOutCreateAccount extends Packet {
        constructor(username, password, token) {
            super(3, { username: username, password: password, token: token });
        }
    }

    class PacketOutRequestUserData extends Packet {
        constructor() {
            super(4, {});
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
                let handled = false;
                let handlerId = this._nodeConnection.addHandler(packet => {
                    if (packet.id == 4) {
                        // @ts-ignore
                        let result = packet.document.data;
                        this._nodeConnection.removeHandler(handlerId);
                        handled = true;
                        resolve(result);
                    }
                });
                this._nodeConnection.sendPacket(new PacketOutRequestUserData());
                setTimeout(() => {
                    if (!handled) {
                        this._nodeConnection.removeHandler(handlerId);
                        currentError.set(new ApplicationError(ErrorIds.user_data_request, "User data request took to long"));
                        resolve(undefined);
                    }
                }, 5000);
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
        request(sendPacket) {
            this._nodeConnection.sendPacket(sendPacket);
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

    class PacketOutRequestApplicationData extends Packet {
        constructor(dataIds) {
            super(5, { dataIds: dataIds });
        }
    }

    const ApplicationDataIds = {
        applicationState: 0,
        applicationType: 1,
        applicationUptime: 2,
        applicationCpuLoad: 3,
        applicationMemoryUsage: 4,
        applicationDescription: 5
    };

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

    function update$1(pageId) {
        if (pageId == PageIds.application) {
            updateApplicationState();
            updateApplicationType();
            updateApplicationUptime();
            updateApplicationCpuLoad();
            updateApplicationDescription();
            updateApplicationMemoryUsage();
        }
    }
    function updateApplicationState() {
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationState]));
                return nodeId;
            });
            return value;
        });
    }
    function updateApplicationType() {
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationType]));
                return nodeId;
            });
            return value;
        });
    }
    function updateApplicationUptime() {
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationUptime]));
                return nodeId;
            });
            return value;
        });
    }
    function updateApplicationCpuLoad() {
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationCpuLoad]));
                return nodeId;
            });
            return value;
        });
    }
    function updateApplicationMemoryUsage() {
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationMemoryUsage]));
                return nodeId;
            });
            return value;
        });
    }
    function updateApplicationDescription() {
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationDescription]));
                return nodeId;
            });
            return value;
        });
    }

    class NetworkManager {
        constructor() {
            this._nodeManager = new NodeManager();
            console.log("Initializing the networkManager...");
            setInterval(() => {
                currentNode.update(value => {
                    let node = this._nodeManager.getNodeById(value);
                    if (node != undefined) {
                        pageId.update(value1 => {
                            update$1(value1);
                            return value1;
                        });
                    }
                    return value;
                });
            }, 1000);
        }
        prepareManager() {
            this._nodeManager.loadNodes();
        }
        get nodeManager() {
            return this._nodeManager;
        }
    }

    class UserData {
        constructor(applicationId, applications) {
            this.applicationId = applicationId;
            this.applications = applications;
        }
    }

    const ApplicationStates = {
        started: 0,
        starting: 1,
        restarting: 2,
        stopped: 3,
        stopping: 4,
    };

    const darkMode = writable(window.localStorage.getItem("darkMode") ? Boolean(JSON.parse(window.localStorage.getItem("darkMode"))) : false);
    const currentNode = writable(window.localStorage.getItem("currentNode") ? Number(JSON.parse(window.localStorage.getItem("currentNode"))) : 0);
    const currentError = writable(undefined);
    const networkManager = writable(new NetworkManager());
    const pageId = writable(PageIds.loading);
    const userData = writable(new UserData(undefined, []));
    const applicationState = writable(ApplicationStates.stopped);
    const applicationType = writable(undefined);
    const applicationUptime = writable(undefined);
    const applicationCpuLoad = writable(undefined);
    const applicationMemoryUsage = writable(undefined);
    const applicationDescription = writable(undefined);
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
    pageId.subscribe(value => {
        update$1(value);
    });

    /* src\components\sidebar\SideBar.svelte generated by Svelte v3.46.3 */
    const file$d = "src\\components\\sidebar\\SideBar.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (11:4) {#if !hideIcon.includes(SideBarIconIds.home) }
    function create_if_block_13(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Home, text: "Home" },
    			$$inline: true
    		});

    	sidebaricon.$on("click", /*click_handler*/ ctx[3]);

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
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(11:4) {#if !hideIcon.includes(SideBarIconIds.home) }",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if !hideIcon.includes(SideBarIconIds.application) }
    function create_if_block_12$1(ctx) {
    	let sidebardivider;
    	let t;
    	let sidebaricon;
    	let current;
    	sidebardivider = new SideBarDivider({ props: { hide: false }, $$inline: true });

    	sidebaricon = new SideBarIcon({
    			props: { icon: Chip, text: "Application" },
    			$$inline: true
    		});

    	sidebaricon.$on("click", /*click_handler_1*/ ctx[4]);

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
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(16:4) {#if !hideIcon.includes(SideBarIconIds.application) }",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#if !hideIcon.includes(SideBarIconIds.options) }
    function create_if_block_11$1(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Adjustments, text: "Options" },
    			$$inline: true
    		});

    	sidebaricon.$on("click", /*click_handler_2*/ ctx[5]);

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
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(22:4) {#if !hideIcon.includes(SideBarIconIds.options) }",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#if !hideIcon.includes(SideBarIconIds.console) }
    function create_if_block_10$1(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Terminal, text: "Console" },
    			$$inline: true
    		});

    	sidebaricon.$on("click", /*click_handler_3*/ ctx[6]);

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
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(27:4) {#if !hideIcon.includes(SideBarIconIds.console) }",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if !hideIcon.includes(SideBarIconIds.files) }
    function create_if_block_9$2(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Folder, text: "Files" },
    			$$inline: true
    		});

    	sidebaricon.$on("click", /*click_handler_4*/ ctx[7]);

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
    		id: create_if_block_9$2.name,
    		type: "if",
    		source: "(32:4) {#if !hideIcon.includes(SideBarIconIds.files) }",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if !hideIcon.includes(SideBarIconIds.access) }
    function create_if_block_8$2(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: { icon: Key, text: "Access" },
    			$$inline: true
    		});

    	sidebaricon.$on("click", /*click_handler_5*/ ctx[8]);

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
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(37:4) {#if !hideIcon.includes(SideBarIconIds.access) }",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#if !hideIcon.includes(SideBarIconIds.create_application) }
    function create_if_block_7$2(ctx) {
    	let sidebardivider;
    	let t;
    	let sidebaricon;
    	let current;
    	sidebardivider = new SideBarDivider({ props: { hide: false }, $$inline: true });

    	sidebaricon = new SideBarIcon({
    			props: { icon: Plus, text: "Create Application" },
    			$$inline: true
    		});

    	sidebaricon.$on("click", /*click_handler_6*/ ctx[9]);

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
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(42:4) {#if !hideIcon.includes(SideBarIconIds.create_application) }",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#if !hideIcon.includes(SideBarIconIds.applications) }
    function create_if_block_1$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$userData*/ ctx[2].applications;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Server, $userData, Chip, Cloud, DesktopComputer, DocumentDuplicate*/ 4) {
    				each_value = /*$userData*/ ctx[2].applications;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(48:4) {#if !hideIcon.includes(SideBarIconIds.applications) }",
    		ctx
    	});

    	return block;
    }

    // (58:45) 
    function create_if_block_6$2(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: {
    				icon: DocumentDuplicate,
    				text: /*application*/ ctx[11].name
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
    		p: function update(ctx, dirty) {
    			const sidebaricon_changes = {};
    			if (dirty & /*$userData*/ 4) sidebaricon_changes.text = /*application*/ ctx[11].name;
    			sidebaricon.$set(sidebaricon_changes);
    		},
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
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(58:45) ",
    		ctx
    	});

    	return block;
    }

    // (56:45) 
    function create_if_block_5$2(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: {
    				icon: DesktopComputer,
    				text: /*application*/ ctx[11].name
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
    		p: function update(ctx, dirty) {
    			const sidebaricon_changes = {};
    			if (dirty & /*$userData*/ 4) sidebaricon_changes.text = /*application*/ ctx[11].name;
    			sidebaricon.$set(sidebaricon_changes);
    		},
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
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(56:45) ",
    		ctx
    	});

    	return block;
    }

    // (54:45) 
    function create_if_block_4$3(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: {
    				icon: Cloud,
    				text: /*application*/ ctx[11].name
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
    		p: function update(ctx, dirty) {
    			const sidebaricon_changes = {};
    			if (dirty & /*$userData*/ 4) sidebaricon_changes.text = /*application*/ ctx[11].name;
    			sidebaricon.$set(sidebaricon_changes);
    		},
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
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(54:45) ",
    		ctx
    	});

    	return block;
    }

    // (52:45) 
    function create_if_block_3$3(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: {
    				icon: Chip,
    				text: /*application*/ ctx[11].name
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
    		p: function update(ctx, dirty) {
    			const sidebaricon_changes = {};
    			if (dirty & /*$userData*/ 4) sidebaricon_changes.text = /*application*/ ctx[11].name;
    			sidebaricon.$set(sidebaricon_changes);
    		},
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
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(52:45) ",
    		ctx
    	});

    	return block;
    }

    // (50:12) {#if application.icon === 0}
    function create_if_block_2$3(ctx) {
    	let sidebaricon;
    	let current;

    	sidebaricon = new SideBarIcon({
    			props: {
    				icon: Server,
    				text: /*application*/ ctx[11].name
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
    		p: function update(ctx, dirty) {
    			const sidebaricon_changes = {};
    			if (dirty & /*$userData*/ 4) sidebaricon_changes.text = /*application*/ ctx[11].name;
    			sidebaricon.$set(sidebaricon_changes);
    		},
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
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(50:12) {#if application.icon === 0}",
    		ctx
    	});

    	return block;
    }

    // (49:8) {#each $userData.applications as application}
    function create_each_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block_2$3,
    		create_if_block_3$3,
    		create_if_block_4$3,
    		create_if_block_5$2,
    		create_if_block_6$2
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*application*/ ctx[11].icon === 0) return 0;
    		if (/*application*/ ctx[11].icon === 1) return 1;
    		if (/*application*/ ctx[11].icon === 2) return 2;
    		if (/*application*/ ctx[11].icon === 3) return 3;
    		if (/*application*/ ctx[11].icon === 4) return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(49:8) {#each $userData.applications as application}",
    		ctx
    	});

    	return block;
    }

    // (63:4) {#if !hideIcon.includes(SideBarIconIds.settings) }
    function create_if_block$8(ctx) {
    	let sidebardivider;
    	let t;
    	let sidebaricon;
    	let current;
    	sidebardivider = new SideBarDivider({ props: { hide: false }, $$inline: true });

    	sidebaricon = new SideBarIcon({
    			props: { icon: FingerPrint, text: "Settings" },
    			$$inline: true
    		});

    	sidebaricon.$on("click", /*click_handler_7*/ ctx[10]);

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
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(63:4) {#if !hideIcon.includes(SideBarIconIds.settings) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
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
    	let if_block0 = show_if_8 && create_if_block_13(ctx);
    	let if_block1 = show_if_7 && create_if_block_12$1(ctx);
    	let if_block2 = show_if_6 && create_if_block_11$1(ctx);
    	let if_block3 = show_if_5 && create_if_block_10$1(ctx);
    	let if_block4 = show_if_4 && create_if_block_9$2(ctx);
    	let if_block5 = show_if_3 && create_if_block_8$2(ctx);
    	let if_block6 = show_if_2 && create_if_block_7$2(ctx);
    	let if_block7 = show_if_1 && create_if_block_1$3(ctx);
    	let if_block8 = show_if && create_if_block$8(ctx);

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
    			attr_dev(div, "class", "fixed top-0 left-0 h-screen w-16 pt-1 flex flex-col bg-white dark:bg-gray-900 shadow-lg");
    			add_location(div, file$d, 9, 0, 446);
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
    					if_block0 = create_if_block_13(ctx);
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
    					if_block1 = create_if_block_12$1(ctx);
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
    					if_block2 = create_if_block_11$1(ctx);
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
    					if_block3 = create_if_block_10$1(ctx);
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
    					if_block4 = create_if_block_9$2(ctx);
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
    					if_block5 = create_if_block_8$2(ctx);
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
    					if_block6 = create_if_block_7$2(ctx);
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
    					if_block7 = create_if_block_1$3(ctx);
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
    					if_block8 = create_if_block$8(ctx);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $userData;
    	validate_store(userData, 'userData');
    	component_subscribe($$self, userData, $$value => $$invalidate(2, $userData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideBar', slots, []);
    	let { hideIcon } = $$props;
    	let { iconPressed } = $$props;
    	const writable_props = ['hideIcon', 'iconPressed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		iconPressed(SideBarIconIds.home);
    	};

    	const click_handler_1 = function () {
    		iconPressed(SideBarIconIds.application);
    	};

    	const click_handler_2 = function () {
    		iconPressed(SideBarIconIds.options);
    	};

    	const click_handler_3 = function () {
    		iconPressed(SideBarIconIds.console);
    	};

    	const click_handler_4 = function () {
    		iconPressed(SideBarIconIds.files);
    	};

    	const click_handler_5 = function () {
    		iconPressed(SideBarIconIds.access);
    	};

    	const click_handler_6 = function () {
    		iconPressed(SideBarIconIds.create_application);
    	};

    	const click_handler_7 = function () {
    		iconPressed(SideBarIconIds.settings);
    	};

    	$$self.$$set = $$props => {
    		if ('hideIcon' in $$props) $$invalidate(0, hideIcon = $$props.hideIcon);
    		if ('iconPressed' in $$props) $$invalidate(1, iconPressed = $$props.iconPressed);
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
    		Cloud,
    		DesktopComputer,
    		DocumentDuplicate,
    		SideBarIcon,
    		SideBarDivider,
    		SideBarIconIds,
    		userData,
    		hideIcon,
    		iconPressed,
    		$userData
    	});

    	$$self.$inject_state = $$props => {
    		if ('hideIcon' in $$props) $$invalidate(0, hideIcon = $$props.hideIcon);
    		if ('iconPressed' in $$props) $$invalidate(1, iconPressed = $$props.iconPressed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hideIcon,
    		iconPressed,
    		$userData,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7
    	];
    }

    class SideBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { hideIcon: 0, iconPressed: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBar",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hideIcon*/ ctx[0] === undefined && !('hideIcon' in props)) {
    			console.warn("<SideBar> was created without expected prop 'hideIcon'");
    		}

    		if (/*iconPressed*/ ctx[1] === undefined && !('iconPressed' in props)) {
    			console.warn("<SideBar> was created without expected prop 'iconPressed'");
    		}
    	}

    	get hideIcon() {
    		throw new Error("<SideBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideIcon(value) {
    		throw new Error("<SideBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconPressed() {
    		throw new Error("<SideBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconPressed(value) {
    		throw new Error("<SideBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\top\TopNavigation.svelte generated by Svelte v3.46.3 */
    const file$c = "src\\components\\top\\TopNavigation.svelte";

    // (30:8) {:else}
    function create_else_block$6(ctx) {
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
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(30:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:8) {#if $darkMode}
    function create_if_block$7(ctx) {
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(28:8) {#if $darkMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
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

    	const if_block_creators = [create_if_block$7, create_else_block$6];
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
    			add_location(p, file$c, 23, 4, 614);
    			attr_dev(h5, "class", "title-text");
    			add_location(h5, file$c, 25, 4, 729);
    			add_location(span, file$c, 26, 4, 770);
    			attr_dev(div, "class", "top-navigation");
    			add_location(div, file$c, 22, 0, 580);
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
    		id: create_fragment$c.name,
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

    function instance$c($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopNavigation",
    			options,
    			id: create_fragment$c.name
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

    /* src\components\other\HomeContent.svelte generated by Svelte v3.46.3 */
    const file$b = "src\\components\\other\\HomeContent.svelte";

    function create_fragment$b(ctx) {
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
    			add_location(span, file$b, 8, 16, 439);
    			attr_dev(h2, "class", "text-3xl font-extralight tracking-tight text-gray-900 dark:text-white sm:text-4xl");
    			add_location(h2, file$b, 7, 12, 327);
    			attr_dev(div0, "class", "mt-9 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between");
    			add_location(div0, file$b, 6, 8, 198);
    			attr_dev(div1, "class", "content-list");
    			add_location(div1, file$b, 5, 4, 162);
    			attr_dev(div2, "class", "content-container");
    			add_location(div2, file$b, 3, 0, 89);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeContent",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\other\LoadingContent.svelte generated by Svelte v3.46.3 */
    const file$a = "src\\components\\other\\LoadingContent.svelte";

    function create_fragment$a(ctx) {
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
    			add_location(div0, file$a, 8, 16, 371);
    			add_location(div1, file$a, 9, 16, 400);
    			add_location(div2, file$a, 10, 16, 429);
    			add_location(div3, file$a, 11, 16, 458);
    			attr_dev(div4, "class", "lds-ellipsis");
    			add_location(div4, file$a, 7, 12, 327);
    			attr_dev(div5, "class", "mt-9 max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between");
    			add_location(div5, file$a, 6, 8, 198);
    			attr_dev(div6, "class", "content-list");
    			add_location(div6, file$a, 5, 4, 162);
    			attr_dev(div7, "class", "content-container");
    			add_location(div7, file$a, 3, 0, 89);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingContent",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\other\LoginContent.svelte generated by Svelte v3.46.3 */
    const file$9 = "src\\components\\other\\LoginContent.svelte";

    // (69:32) {:else}
    function create_else_block$5(ctx) {
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
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(69:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:32) {#if siteState}
    function create_if_block$6(ctx) {
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
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(67:32) {#if siteState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
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

    	const if_block_creators = [create_if_block$6, create_else_block$5];
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
    			add_location(img, file$9, 25, 20, 876);
    			attr_dev(h2, "class", "text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300");
    			add_location(h2, file$9, 26, 20, 971);
    			attr_dev(span0, "class", "cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500");
    			add_location(span0, file$9, 27, 96, 1176);
    			attr_dev(p, "class", "mt-2 text-center text-sm text-gray-600 dark:text-gray-400");
    			add_location(p, file$9, 27, 20, 1100);
    			add_location(div0, file$9, 24, 16, 849);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "remember");
    			attr_dev(input0, "defaultvalue", "true");
    			add_location(input0, file$9, 40, 20, 1910);
    			attr_dev(input1, "id", "loginUsernameInput");
    			attr_dev(input1, "name", "loginUsernameInput");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "autocomplete", "text");
    			input1.required = true;
    			attr_dev(input1, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input1, "placeholder", "Username");
    			add_location(input1, file$9, 43, 28, 2098);
    			add_location(div1, file$9, 42, 24, 2063);
    			attr_dev(input2, "id", "loginPasswordInput");
    			attr_dev(input2, "name", "loginPasswordInput");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "autocomplete", "current-password");
    			input2.required = true;
    			attr_dev(input2, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input2, "placeholder", "Password");
    			add_location(input2, file$9, 46, 28, 2637);
    			add_location(div2, file$9, 45, 24, 2602);
    			attr_dev(div3, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div3, file$9, 41, 20, 1991);
    			attr_dev(input3, "id", "remember-me");
    			attr_dev(input3, "name", "remember-me");
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "class", "h-4 w-4 text-indigo-600 bg-white dark:bg-gray-500 focus:ring-indigo-500 border-gray-300 rounded");
    			add_location(input3, file$9, 52, 28, 3317);
    			attr_dev(label, "for", "remember-me");
    			attr_dev(label, "class", "ml-2 block text-sm dark:text-gray-300 text-gray-500");
    			add_location(label, file$9, 53, 28, 3511);
    			attr_dev(div4, "class", "flex items-center");
    			add_location(div4, file$9, 51, 24, 3256);
    			attr_dev(span1, "class", "cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500");
    			add_location(span1, file$9, 59, 28, 3790);
    			attr_dev(div5, "class", "text-sm");
    			add_location(div5, file$9, 58, 24, 3739);
    			attr_dev(div6, "class", "flex items-center justify-between");
    			add_location(div6, file$9, 50, 20, 3183);
    			attr_dev(span2, "class", "absolute left-0 inset-y-0 flex items-center pl-3");
    			add_location(span2, file$9, 65, 28, 4321);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$9, 64, 24, 4033);
    			add_location(div7, file$9, 63, 20, 4002);
    			attr_dev(form, "class", "mt-8 space-y-6");
    			attr_dev(form, "action", "#");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$9, 31, 16, 1437);
    			attr_dev(div8, "class", "max-w-md w-full space-y-8");
    			add_location(div8, file$9, 23, 12, 792);
    			attr_dev(div9, "class", "mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8");
    			add_location(div9, file$9, 22, 8, 713);
    			attr_dev(div10, "class", "content-list");
    			add_location(div10, file$9, 21, 4, 677);
    			attr_dev(div11, "class", "content-container");
    			add_location(div11, file$9, 19, 0, 602);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			submitCallback: 0,
    			changeToRegisterCallback: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoginContent",
    			options,
    			id: create_fragment$9.name
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

    /* src\components\other\AddNodeContent.svelte generated by Svelte v3.46.3 */
    const file$8 = "src\\components\\other\\AddNodeContent.svelte";

    // (54:32) {:else}
    function create_else_block$4(ctx) {
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(54:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:32) {#if siteState}
    function create_if_block$5(ctx) {
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(52:32) {#if siteState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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
    	const if_block_creators = [create_if_block$5, create_else_block$4];
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
    			add_location(img, file$8, 24, 20, 835);
    			attr_dev(h2, "class", "text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300");
    			add_location(h2, file$8, 25, 20, 930);
    			attr_dev(p, "class", "mt-2 text-center text-sm text-gray-600 dark:text-gray-400");
    			add_location(p, file$8, 26, 20, 1046);
    			add_location(div0, file$8, 23, 16, 808);
    			attr_dev(input0, "type", "hidden");
    			attr_dev(input0, "name", "remember");
    			attr_dev(input0, "defaultvalue", "true");
    			add_location(input0, file$8, 39, 20, 1700);
    			attr_dev(input1, "id", "nodeServerAddressInput");
    			attr_dev(input1, "name", "nodeServerAddressInput");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "autocomplete", "text");
    			input1.required = true;
    			attr_dev(input1, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input1, "placeholder", "Server address");
    			add_location(input1, file$8, 42, 28, 1888);
    			add_location(div1, file$8, 41, 24, 1853);
    			attr_dev(input2, "id", "nodePortInput");
    			attr_dev(input2, "name", "nodePortInput");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "autocomplete", "port");
    			input2.required = true;
    			attr_dev(input2, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input2, "placeholder", "Port");
    			add_location(input2, file$8, 45, 28, 2441);
    			add_location(div2, file$8, 44, 24, 2406);
    			attr_dev(div3, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div3, file$8, 40, 20, 1781);
    			attr_dev(span, "class", "absolute left-0 inset-y-0 flex items-center pl-3");
    			add_location(span, file$8, 50, 28, 3276);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$8, 49, 24, 2988);
    			add_location(div4, file$8, 48, 20, 2957);
    			attr_dev(form, "class", "mt-8 space-y-6");
    			attr_dev(form, "action", "#");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$8, 30, 16, 1276);
    			attr_dev(div5, "class", "max-w-md w-full space-y-8");
    			add_location(div5, file$8, 22, 12, 751);
    			attr_dev(div6, "class", "mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8");
    			add_location(div6, file$8, 21, 8, 672);
    			attr_dev(div7, "class", "content-list");
    			add_location(div7, file$8, 20, 4, 636);
    			attr_dev(div8, "class", "content-container");
    			add_location(div8, file$8, 18, 0, 562);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { submitCallback: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddNodeContent",
    			options,
    			id: create_fragment$8.name
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

    /* src\components\other\RegisterContent.svelte generated by Svelte v3.46.3 */
    const file$7 = "src\\components\\other\\RegisterContent.svelte";

    // (72:32) {:else}
    function create_else_block$3(ctx) {
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(72:32) {:else}",
    		ctx
    	});

    	return block;
    }

    // (70:32) {#if siteState}
    function create_if_block$4(ctx) {
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(70:32) {#if siteState}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
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

    	const if_block_creators = [create_if_block$4, create_else_block$3];
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
    			add_location(img, file$7, 26, 20, 945);
    			attr_dev(h2, "class", "text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300");
    			add_location(h2, file$7, 27, 20, 1040);
    			attr_dev(span0, "class", "cursor-pointer font-medium dark:text-indigo-400 text-indigo-600 hover:text-indigo-500");
    			add_location(span0, file$7, 28, 96, 1243);
    			attr_dev(p, "class", "mt-2 text-center text-sm text-gray-600 dark:text-gray-400");
    			add_location(p, file$7, 28, 20, 1167);
    			add_location(div0, file$7, 25, 16, 918);
    			attr_dev(input0, "id", "createTokenInput");
    			attr_dev(input0, "name", "createTokenInput");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "autocomplete", "text");
    			input0.required = true;
    			attr_dev(input0, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input0, "placeholder", "Token");
    			add_location(input0, file$7, 51, 24, 2553);
    			attr_dev(div1, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div1, file$7, 50, 20, 2481);
    			attr_dev(input1, "id", "createUsernameInput");
    			attr_dev(input1, "name", "createUsernameInput");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "autocomplete", "text");
    			input1.required = true;
    			attr_dev(input1, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input1, "placeholder", "Username");
    			add_location(input1, file$7, 56, 28, 3151);
    			add_location(div2, file$7, 55, 24, 3116);
    			attr_dev(input2, "id", "createPasswordInput");
    			attr_dev(input2, "name", "createPasswordInput");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "autocomplete", "current-password");
    			input2.required = true;
    			attr_dev(input2, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input2, "placeholder", "Password");
    			add_location(input2, file$7, 59, 28, 3692);
    			add_location(div3, file$7, 58, 24, 3657);
    			attr_dev(input3, "id", "createPasswordConfirmInput");
    			attr_dev(input3, "name", "createPasswordConfirmInput");
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "autocomplete", "current-password");
    			input3.required = true;
    			attr_dev(input3, "class", "appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm");
    			attr_dev(input3, "placeholder", "Confirm Password");
    			add_location(input3, file$7, 62, 28, 4249);
    			add_location(div4, file$7, 61, 24, 4214);
    			attr_dev(div5, "class", "rounded-md shadow-sm -space-y-px");
    			add_location(div5, file$7, 54, 20, 3044);
    			attr_dev(span1, "class", "absolute left-0 inset-y-0 flex items-center pl-3");
    			add_location(span1, file$7, 68, 28, 5138);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500");
    			add_location(button, file$7, 67, 24, 4850);
    			add_location(div6, file$7, 66, 20, 4819);
    			attr_dev(form, "class", "mt-8 space-y-6");
    			attr_dev(form, "action", "#");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$7, 32, 16, 1496);
    			attr_dev(div7, "class", "max-w-md w-full space-y-8");
    			add_location(div7, file$7, 24, 12, 861);
    			attr_dev(div8, "class", "mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8");
    			add_location(div8, file$7, 23, 8, 782);
    			attr_dev(div9, "class", "content-list");
    			add_location(div9, file$7, 22, 4, 746);
    			attr_dev(div10, "class", "content-container");
    			add_location(div10, file$7, 20, 0, 662);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			submitCallback: 0,
    			changeToLoginCallback: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RegisterContent",
    			options,
    			id: create_fragment$7.name
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

    /* src\components\application\status\ApplicationStatus.svelte generated by Svelte v3.46.3 */

    const file$6 = "src\\components\\application\\status\\ApplicationStatus.svelte";

    // (13:12) {:else}
    function create_else_block_7(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: { src: Play, class: "-ml-1 mr-2 h-5 w-5" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("Start");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:bg-green-700");
    			add_location(button, file$6, 13, 16, 1111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
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
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_7.name,
    		type: "else",
    		source: "(13:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:12) {#if $applicationState === ApplicationStates.starting}
    function create_if_block_12(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("Start");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:bg-green-700");
    			add_location(button, file$6, 11, 16, 770);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
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
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(11:12) {#if $applicationState === ApplicationStates.starting}",
    		ctx
    	});

    	return block;
    }

    // (18:12) {:else}
    function create_else_block_6(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("Restart");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-450 hover:bg-yellow-500");
    			add_location(button, file$6, 18, 16, 1820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
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
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_6.name,
    		type: "else",
    		source: "(18:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:12) {#if $applicationState === ApplicationStates.restarting}
    function create_if_block_11(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("Restart");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-450 hover:bg-yellow-500");
    			add_location(button, file$6, 16, 16, 1494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
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
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(16:12) {#if $applicationState === ApplicationStates.restarting}",
    		ctx
    	});

    	return block;
    }

    // (23:12) {:else}
    function create_else_block_5(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: { src: Stop, class: "-ml-1 mr-2 h-5 w-5" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("Stop");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:bg-red-700");
    			add_location(button, file$6, 23, 16, 2523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
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
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_5.name,
    		type: "else",
    		source: "(23:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:12) {#if $applicationState === ApplicationStates.stopping}
    function create_if_block_10(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("Stop");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:bg-red-700");
    			add_location(button, file$6, 21, 16, 2189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
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
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(21:12) {#if $applicationState === ApplicationStates.stopping}",
    		ctx
    	});

    	return block;
    }

    // (40:74) 
    function create_if_block_9$1(ctx) {
    	let dd;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			dd.textContent = "Offline";
    			attr_dev(dd, "class", "mt-1 text-sm text-red-600 font-medium sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 40, 20, 3959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(40:74) ",
    		ctx
    	});

    	return block;
    }

    // (38:75) 
    function create_if_block_8$1(ctx) {
    	let dd;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			dd.textContent = "Stopping";
    			attr_dev(dd, "class", "mt-1 text-sm text-red-600 font-medium sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 38, 20, 3776);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(38:75) ",
    		ctx
    	});

    	return block;
    }

    // (36:77) 
    function create_if_block_7$1(ctx) {
    	let dd;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			dd.textContent = "Restarting";
    			attr_dev(dd, "class", "mt-1 text-sm text-orange-450 font-medium sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 36, 20, 3587);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(36:77) ",
    		ctx
    	});

    	return block;
    }

    // (34:75) 
    function create_if_block_6$1(ctx) {
    	let dd;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			dd.textContent = "Starting";
    			attr_dev(dd, "class", "mt-1 text-sm text-green-500 font-medium sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 34, 20, 3399);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(34:75) ",
    		ctx
    	});

    	return block;
    }

    // (32:16) {#if $applicationState === ApplicationStates.started}
    function create_if_block_5$1(ctx) {
    	let dd;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			dd.textContent = "Online";
    			attr_dev(dd, "class", "mt-1 text-sm text-green-500 font-medium sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 32, 20, 3215);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(32:16) {#if $applicationState === ApplicationStates.started}",
    		ctx
    	});

    	return block;
    }

    // (48:16) {:else}
    function create_else_block_4(ctx) {
    	let dd;
    	let t;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			t = text(/*$applicationType*/ ctx[1]);
    			attr_dev(dd, "class", "mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 48, 20, 4551);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			append_dev(dd, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$applicationType*/ 2) set_data_dev(t, /*$applicationType*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(48:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:16) {#if $applicationType === undefined}
    function create_if_block_4$2(ctx) {
    	let dd;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			create_component(icon.$$.fragment);
    			attr_dev(dd, "class", "mt-1 text-gray-500 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 46, 20, 4354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			mount_component(icon, dd, null);
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
    			if (detaching) detach_dev(dd);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(46:16) {#if $applicationType === undefined}",
    		ctx
    	});

    	return block;
    }

    // (56:16) {:else}
    function create_else_block_3(ctx) {
    	let dd;
    	let t;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			t = text(/*$applicationUptime*/ ctx[2]);
    			attr_dev(dd, "class", "mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 56, 20, 5176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			append_dev(dd, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$applicationUptime*/ 4) set_data_dev(t, /*$applicationUptime*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(56:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:16) {#if $applicationUptime === undefined}
    function create_if_block_3$2(ctx) {
    	let dd;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			create_component(icon.$$.fragment);
    			attr_dev(dd, "class", "mt-1 text-gray-500 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 54, 20, 4979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			mount_component(icon, dd, null);
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
    			if (detaching) detach_dev(dd);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(54:16) {#if $applicationUptime === undefined}",
    		ctx
    	});

    	return block;
    }

    // (64:16) {:else}
    function create_else_block_2(ctx) {
    	let dd;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			t0 = text(/*$applicationCpuLoad*/ ctx[3]);
    			t1 = text("%");
    			attr_dev(dd, "class", "mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 64, 20, 5796);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			append_dev(dd, t0);
    			append_dev(dd, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$applicationCpuLoad*/ 8) set_data_dev(t0, /*$applicationCpuLoad*/ ctx[3]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(64:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (62:16) {#if $applicationCpuLoad === undefined}
    function create_if_block_2$2(ctx) {
    	let dd;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			create_component(icon.$$.fragment);
    			attr_dev(dd, "class", "mt-1 text-gray-500 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 62, 20, 5599);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			mount_component(icon, dd, null);
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
    			if (detaching) detach_dev(dd);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(62:16) {#if $applicationCpuLoad === undefined}",
    		ctx
    	});

    	return block;
    }

    // (72:16) {:else}
    function create_else_block_1(ctx) {
    	let dd;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			dd.textContent = "Nothing";
    			attr_dev(dd, "class", "mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 72, 20, 6423);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(72:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (70:16) {#if $applicationCpuLoad === undefined}
    function create_if_block_1$2(ctx) {
    	let dd;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			create_component(icon.$$.fragment);
    			attr_dev(dd, "class", "mt-1 text-gray-500 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 70, 20, 6226);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			mount_component(icon, dd, null);
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
    			if (detaching) detach_dev(dd);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(70:16) {#if $applicationCpuLoad === undefined}",
    		ctx
    	});

    	return block;
    }

    // (82:16) {:else}
    function create_else_block$2(ctx) {
    	let dd;
    	let t0_value = /*$applicationMemoryUsage*/ ctx[4][0] + "";
    	let t0;
    	let t1;
    	let t2_value = /*$applicationMemoryUsage*/ ctx[4][1] + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			t0 = text(t0_value);
    			t1 = text(" MB / ");
    			t2 = text(t2_value);
    			t3 = text(" MB");
    			attr_dev(dd, "class", "mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 82, 20, 7086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			append_dev(dd, t0);
    			append_dev(dd, t1);
    			append_dev(dd, t2);
    			append_dev(dd, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$applicationMemoryUsage*/ 16 && t0_value !== (t0_value = /*$applicationMemoryUsage*/ ctx[4][0] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$applicationMemoryUsage*/ 16 && t2_value !== (t2_value = /*$applicationMemoryUsage*/ ctx[4][1] + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dd);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(82:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (80:16) {#if $applicationMemoryUsage === undefined}
    function create_if_block$3(ctx) {
    	let dd;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			create_component(icon.$$.fragment);
    			attr_dev(dd, "class", "mt-1 text-gray-500 dark:text-gray-400 sm:mt-0 sm:col-span-2");
    			add_location(dd, file$6, 80, 20, 6889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			mount_component(icon, dd, null);
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
    			if (detaching) detach_dev(dd);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(80:16) {#if $applicationMemoryUsage === undefined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div9;
    	let div1;
    	let h3;
    	let t1;
    	let p;
    	let t3;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t4;
    	let current_block_type_index_1;
    	let if_block1;
    	let t5;
    	let current_block_type_index_2;
    	let if_block2;
    	let t6;
    	let div8;
    	let dl;
    	let div2;
    	let dt0;
    	let t8;
    	let t9;
    	let div3;
    	let dt1;
    	let t11;
    	let current_block_type_index_3;
    	let if_block4;
    	let t12;
    	let div4;
    	let dt2;
    	let t14;
    	let current_block_type_index_4;
    	let if_block5;
    	let t15;
    	let div5;
    	let dt3;
    	let t17;
    	let current_block_type_index_5;
    	let if_block6;
    	let t18;
    	let div6;
    	let dt4;
    	let t20;
    	let current_block_type_index_6;
    	let if_block7;
    	let t21;
    	let div7;
    	let dt5;
    	let t23;
    	let current_block_type_index_7;
    	let if_block8;
    	let current;
    	const if_block_creators = [create_if_block_12, create_else_block_7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$applicationState*/ ctx[0] === ApplicationStates.starting) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_11, create_else_block_6];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$applicationState*/ ctx[0] === ApplicationStates.restarting) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	const if_block_creators_2 = [create_if_block_10, create_else_block_5];
    	const if_blocks_2 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*$applicationState*/ ctx[0] === ApplicationStates.stopping) return 0;
    		return 1;
    	}

    	current_block_type_index_2 = select_block_type_2(ctx);
    	if_block2 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);

    	function select_block_type_3(ctx, dirty) {
    		if (/*$applicationState*/ ctx[0] === ApplicationStates.started) return create_if_block_5$1;
    		if (/*$applicationState*/ ctx[0] === ApplicationStates.starting) return create_if_block_6$1;
    		if (/*$applicationState*/ ctx[0] === ApplicationStates.restarting) return create_if_block_7$1;
    		if (/*$applicationState*/ ctx[0] === ApplicationStates.stopping) return create_if_block_8$1;
    		if (/*$applicationState*/ ctx[0] === ApplicationStates.stopped) return create_if_block_9$1;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block3 = current_block_type && current_block_type(ctx);
    	const if_block_creators_3 = [create_if_block_4$2, create_else_block_4];
    	const if_blocks_3 = [];

    	function select_block_type_4(ctx, dirty) {
    		if (/*$applicationType*/ ctx[1] === undefined) return 0;
    		return 1;
    	}

    	current_block_type_index_3 = select_block_type_4(ctx);
    	if_block4 = if_blocks_3[current_block_type_index_3] = if_block_creators_3[current_block_type_index_3](ctx);
    	const if_block_creators_4 = [create_if_block_3$2, create_else_block_3];
    	const if_blocks_4 = [];

    	function select_block_type_5(ctx, dirty) {
    		if (/*$applicationUptime*/ ctx[2] === undefined) return 0;
    		return 1;
    	}

    	current_block_type_index_4 = select_block_type_5(ctx);
    	if_block5 = if_blocks_4[current_block_type_index_4] = if_block_creators_4[current_block_type_index_4](ctx);
    	const if_block_creators_5 = [create_if_block_2$2, create_else_block_2];
    	const if_blocks_5 = [];

    	function select_block_type_6(ctx, dirty) {
    		if (/*$applicationCpuLoad*/ ctx[3] === undefined) return 0;
    		return 1;
    	}

    	current_block_type_index_5 = select_block_type_6(ctx);
    	if_block6 = if_blocks_5[current_block_type_index_5] = if_block_creators_5[current_block_type_index_5](ctx);
    	const if_block_creators_6 = [create_if_block_1$2, create_else_block_1];
    	const if_blocks_6 = [];

    	function select_block_type_7(ctx, dirty) {
    		if (/*$applicationCpuLoad*/ ctx[3] === undefined) return 0;
    		return 1;
    	}

    	current_block_type_index_6 = select_block_type_7(ctx);
    	if_block7 = if_blocks_6[current_block_type_index_6] = if_block_creators_6[current_block_type_index_6](ctx);
    	const if_block_creators_7 = [create_if_block$3, create_else_block$2];
    	const if_blocks_7 = [];

    	function select_block_type_8(ctx, dirty) {
    		if (/*$applicationMemoryUsage*/ ctx[4] === undefined) return 0;
    		return 1;
    	}

    	current_block_type_index_7 = select_block_type_8(ctx);
    	if_block8 = if_blocks_7[current_block_type_index_7] = if_block_creators_7[current_block_type_index_7](ctx);

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Application Information";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Information about the Application";
    			t3 = space();
    			div0 = element("div");
    			if_block0.c();
    			t4 = space();
    			if_block1.c();
    			t5 = space();
    			if_block2.c();
    			t6 = space();
    			div8 = element("div");
    			dl = element("dl");
    			div2 = element("div");
    			dt0 = element("dt");
    			dt0.textContent = "Current Status";
    			t8 = space();
    			if (if_block3) if_block3.c();
    			t9 = space();
    			div3 = element("div");
    			dt1 = element("dt");
    			dt1.textContent = "Type";
    			t11 = space();
    			if_block4.c();
    			t12 = space();
    			div4 = element("div");
    			dt2 = element("dt");
    			dt2.textContent = "Current Uptime";
    			t14 = space();
    			if_block5.c();
    			t15 = space();
    			div5 = element("div");
    			dt3 = element("dt");
    			dt3.textContent = "CPU load";
    			t17 = space();
    			if_block6.c();
    			t18 = space();
    			div6 = element("div");
    			dt4 = element("dt");
    			dt4.textContent = "Description";
    			t20 = space();
    			if_block7.c();
    			t21 = space();
    			div7 = element("div");
    			dt5 = element("dt");
    			dt5.textContent = "Memory Usage";
    			t23 = space();
    			if_block8.c();
    			attr_dev(h3, "class", "text-lg leading-6 font-medium text-gray-900 dark:text-white");
    			add_location(h3, file$6, 7, 8, 431);
    			attr_dev(p, "class", "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400");
    			add_location(p, file$6, 8, 8, 541);
    			attr_dev(div0, "class", "text-right mt-2");
    			add_location(div0, file$6, 9, 8, 655);
    			attr_dev(div1, "class", "px-4 py-5 sm:px-6");
    			add_location(div1, file$6, 6, 4, 390);
    			attr_dev(dt0, "class", "text-sm font-medium text-gray-500 dark:text-white");
    			add_location(dt0, file$6, 30, 16, 3041);
    			attr_dev(div2, "class", "bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div2, file$6, 29, 12, 2932);
    			attr_dev(dt1, "class", "text-sm font-medium text-gray-500 dark:text-white");
    			add_location(dt1, file$6, 44, 16, 4207);
    			attr_dev(div3, "class", "bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div3, file$6, 43, 12, 4100);
    			attr_dev(dt2, "class", "text-sm font-medium text-gray-500 dark:text-white");
    			add_location(dt2, file$6, 52, 16, 4820);
    			attr_dev(div4, "class", "bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div4, file$6, 51, 12, 4711);
    			attr_dev(dt3, "class", "text-sm font-medium text-gray-500 dark:text-white");
    			add_location(dt3, file$6, 60, 16, 5445);
    			attr_dev(div5, "class", "bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div5, file$6, 59, 12, 5338);
    			attr_dev(dt4, "class", "text-sm font-medium text-gray-500 dark:text-white");
    			add_location(dt4, file$6, 68, 16, 6069);
    			attr_dev(div6, "class", "bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div6, file$6, 67, 12, 5960);
    			attr_dev(dt5, "class", "text-sm font-medium text-gray-500 dark:text-white");
    			add_location(dt5, file$6, 78, 16, 6727);
    			attr_dev(div7, "class", "bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div7, file$6, 77, 12, 6620);
    			add_location(dl, file$6, 28, 8, 2914);
    			attr_dev(div8, "class", "border-t border-gray-200 dark:border-gray-850");
    			add_location(div8, file$6, 27, 4, 2845);
    			attr_dev(div9, "class", "mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg");
    			add_location(div9, file$6, 5, 0, 304);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div1);
    			append_dev(div1, h3);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div0, t4);
    			if_blocks_1[current_block_type_index_1].m(div0, null);
    			append_dev(div0, t5);
    			if_blocks_2[current_block_type_index_2].m(div0, null);
    			append_dev(div9, t6);
    			append_dev(div9, div8);
    			append_dev(div8, dl);
    			append_dev(dl, div2);
    			append_dev(div2, dt0);
    			append_dev(div2, t8);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t9);
    			append_dev(dl, div3);
    			append_dev(div3, dt1);
    			append_dev(div3, t11);
    			if_blocks_3[current_block_type_index_3].m(div3, null);
    			append_dev(div3, t12);
    			append_dev(dl, div4);
    			append_dev(div4, dt2);
    			append_dev(div4, t14);
    			if_blocks_4[current_block_type_index_4].m(div4, null);
    			append_dev(div4, t15);
    			append_dev(dl, div5);
    			append_dev(div5, dt3);
    			append_dev(div5, t17);
    			if_blocks_5[current_block_type_index_5].m(div5, null);
    			append_dev(div5, t18);
    			append_dev(dl, div6);
    			append_dev(div6, dt4);
    			append_dev(div6, t20);
    			if_blocks_6[current_block_type_index_6].m(div6, null);
    			append_dev(div6, t21);
    			append_dev(dl, div7);
    			append_dev(div7, dt5);
    			append_dev(div7, t23);
    			if_blocks_7[current_block_type_index_7].m(div7, null);
    			current = true;
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
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, t4);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div0, t5);
    			}

    			let previous_block_index_2 = current_block_type_index_2;
    			current_block_type_index_2 = select_block_type_2(ctx);

    			if (current_block_type_index_2 === previous_block_index_2) {
    				if_blocks_2[current_block_type_index_2].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_2[previous_block_index_2], 1, 1, () => {
    					if_blocks_2[previous_block_index_2] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks_2[current_block_type_index_2];

    				if (!if_block2) {
    					if_block2 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div0, null);
    			}

    			if (current_block_type !== (current_block_type = select_block_type_3(ctx))) {
    				if (if_block3) if_block3.d(1);
    				if_block3 = current_block_type && current_block_type(ctx);

    				if (if_block3) {
    					if_block3.c();
    					if_block3.m(div2, t9);
    				}
    			}

    			let previous_block_index_3 = current_block_type_index_3;
    			current_block_type_index_3 = select_block_type_4(ctx);

    			if (current_block_type_index_3 === previous_block_index_3) {
    				if_blocks_3[current_block_type_index_3].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_3[previous_block_index_3], 1, 1, () => {
    					if_blocks_3[previous_block_index_3] = null;
    				});

    				check_outros();
    				if_block4 = if_blocks_3[current_block_type_index_3];

    				if (!if_block4) {
    					if_block4 = if_blocks_3[current_block_type_index_3] = if_block_creators_3[current_block_type_index_3](ctx);
    					if_block4.c();
    				} else {
    					if_block4.p(ctx, dirty);
    				}

    				transition_in(if_block4, 1);
    				if_block4.m(div3, t12);
    			}

    			let previous_block_index_4 = current_block_type_index_4;
    			current_block_type_index_4 = select_block_type_5(ctx);

    			if (current_block_type_index_4 === previous_block_index_4) {
    				if_blocks_4[current_block_type_index_4].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_4[previous_block_index_4], 1, 1, () => {
    					if_blocks_4[previous_block_index_4] = null;
    				});

    				check_outros();
    				if_block5 = if_blocks_4[current_block_type_index_4];

    				if (!if_block5) {
    					if_block5 = if_blocks_4[current_block_type_index_4] = if_block_creators_4[current_block_type_index_4](ctx);
    					if_block5.c();
    				} else {
    					if_block5.p(ctx, dirty);
    				}

    				transition_in(if_block5, 1);
    				if_block5.m(div4, t15);
    			}

    			let previous_block_index_5 = current_block_type_index_5;
    			current_block_type_index_5 = select_block_type_6(ctx);

    			if (current_block_type_index_5 === previous_block_index_5) {
    				if_blocks_5[current_block_type_index_5].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_5[previous_block_index_5], 1, 1, () => {
    					if_blocks_5[previous_block_index_5] = null;
    				});

    				check_outros();
    				if_block6 = if_blocks_5[current_block_type_index_5];

    				if (!if_block6) {
    					if_block6 = if_blocks_5[current_block_type_index_5] = if_block_creators_5[current_block_type_index_5](ctx);
    					if_block6.c();
    				} else {
    					if_block6.p(ctx, dirty);
    				}

    				transition_in(if_block6, 1);
    				if_block6.m(div5, t18);
    			}

    			let previous_block_index_6 = current_block_type_index_6;
    			current_block_type_index_6 = select_block_type_7(ctx);

    			if (current_block_type_index_6 === previous_block_index_6) {
    				if_blocks_6[current_block_type_index_6].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_6[previous_block_index_6], 1, 1, () => {
    					if_blocks_6[previous_block_index_6] = null;
    				});

    				check_outros();
    				if_block7 = if_blocks_6[current_block_type_index_6];

    				if (!if_block7) {
    					if_block7 = if_blocks_6[current_block_type_index_6] = if_block_creators_6[current_block_type_index_6](ctx);
    					if_block7.c();
    				} else {
    					if_block7.p(ctx, dirty);
    				}

    				transition_in(if_block7, 1);
    				if_block7.m(div6, t21);
    			}

    			let previous_block_index_7 = current_block_type_index_7;
    			current_block_type_index_7 = select_block_type_8(ctx);

    			if (current_block_type_index_7 === previous_block_index_7) {
    				if_blocks_7[current_block_type_index_7].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_7[previous_block_index_7], 1, 1, () => {
    					if_blocks_7[previous_block_index_7] = null;
    				});

    				check_outros();
    				if_block8 = if_blocks_7[current_block_type_index_7];

    				if (!if_block8) {
    					if_block8 = if_blocks_7[current_block_type_index_7] = if_block_creators_7[current_block_type_index_7](ctx);
    					if_block8.c();
    				} else {
    					if_block8.p(ctx, dirty);
    				}

    				transition_in(if_block8, 1);
    				if_block8.m(div7, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
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
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			transition_out(if_block8);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			if_blocks_2[current_block_type_index_2].d();

    			if (if_block3) {
    				if_block3.d();
    			}

    			if_blocks_3[current_block_type_index_3].d();
    			if_blocks_4[current_block_type_index_4].d();
    			if_blocks_5[current_block_type_index_5].d();
    			if_blocks_6[current_block_type_index_6].d();
    			if_blocks_7[current_block_type_index_7].d();
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

    function instance$6($$self, $$props, $$invalidate) {
    	let $applicationState;
    	let $applicationType;
    	let $applicationUptime;
    	let $applicationCpuLoad;
    	let $applicationMemoryUsage;
    	validate_store(applicationState, 'applicationState');
    	component_subscribe($$self, applicationState, $$value => $$invalidate(0, $applicationState = $$value));
    	validate_store(applicationType, 'applicationType');
    	component_subscribe($$self, applicationType, $$value => $$invalidate(1, $applicationType = $$value));
    	validate_store(applicationUptime, 'applicationUptime');
    	component_subscribe($$self, applicationUptime, $$value => $$invalidate(2, $applicationUptime = $$value));
    	validate_store(applicationCpuLoad, 'applicationCpuLoad');
    	component_subscribe($$self, applicationCpuLoad, $$value => $$invalidate(3, $applicationCpuLoad = $$value));
    	validate_store(applicationMemoryUsage, 'applicationMemoryUsage');
    	component_subscribe($$self, applicationMemoryUsage, $$value => $$invalidate(4, $applicationMemoryUsage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ApplicationStatus', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ApplicationStatus> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Icon,
    		Play,
    		Refresh,
    		Stop,
    		ApplicationStates,
    		applicationCpuLoad,
    		applicationMemoryUsage,
    		applicationState,
    		applicationType,
    		applicationUptime,
    		$applicationState,
    		$applicationType,
    		$applicationUptime,
    		$applicationCpuLoad,
    		$applicationMemoryUsage
    	});

    	return [
    		$applicationState,
    		$applicationType,
    		$applicationUptime,
    		$applicationCpuLoad,
    		$applicationMemoryUsage
    	];
    }

    class ApplicationStatus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ApplicationStatus",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\application\status\ApplicationContent.svelte generated by Svelte v3.46.3 */
    const file$5 = "src\\components\\application\\status\\ApplicationContent.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let topnavigation;
    	let t;
    	let applicationstatus;
    	let current;

    	topnavigation = new TopNavigation({
    			props: { title: "Application" },
    			$$inline: true
    		});

    	applicationstatus = new ApplicationStatus({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(topnavigation.$$.fragment);
    			t = space();
    			create_component(applicationstatus.$$.fragment);
    			attr_dev(div, "class", "content-container");
    			add_location(div, file$5, 4, 0, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(topnavigation, div, null);
    			append_dev(div, t);
    			mount_component(applicationstatus, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			transition_in(applicationstatus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			transition_out(applicationstatus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(topnavigation);
    			destroy_component(applicationstatus);
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
    	validate_slots('ApplicationContent', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ApplicationContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TopNavigation, ApplicationStatus });
    	return [];
    }

    class ApplicationContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ApplicationContent",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\application\console\ConsoleContent.svelte generated by Svelte v3.46.3 */
    const file$4 = "src\\components\\application\\console\\ConsoleContent.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (17:12) {#each messages as message}
    function create_each_block$2(ctx) {
    	let div;
    	let t_value = /*message*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "console-line");
    			add_location(div, file$4, 17, 16, 603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1 && t_value !== (t_value = /*message*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(17:12) {#each messages as message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div3;
    	let topnavigation;
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let form;
    	let input;
    	let t2;
    	let div2;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	topnavigation = new TopNavigation({
    			props: { title: "Console" },
    			$$inline: true
    		});

    	let each_value = /*messages*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	icon = new Icon({
    			props: {
    				src: Check,
    				size: "26",
    				class: "text-green-500 mx-2 dark:text-primary cursor-pointer"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			form = element("form");
    			input = element("input");
    			t2 = space();
    			div2 = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div0, "class", "console");
    			add_location(div0, file$4, 15, 8, 523);
    			attr_dev(div1, "class", "content-list");
    			add_location(div1, file$4, 14, 4, 487);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "console-input");
    			attr_dev(input, "placeholder", "Enter command...");
    			attr_dev(input, "class", "bottom-bar-input");
    			add_location(input, file$4, 22, 8, 802);
    			add_location(div2, file$4, 23, 8, 908);
    			attr_dev(form, "class", "bottom-bar");
    			add_location(form, file$4, 21, 4, 699);
    			attr_dev(div3, "class", "content-container");
    			add_location(div3, file$4, 12, 0, 410);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(topnavigation, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, form);
    			append_dev(form, input);
    			append_dev(form, t2);
    			append_dev(form, div2);
    			mount_component(icon, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(form, "submit", /*submit_handler*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*messages*/ 1) {
    				each_value = /*messages*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(topnavigation);
    			destroy_each(each_blocks, detaching);
    			destroy_component(icon);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('ConsoleContent', slots, []);
    	let messages = ["Test1", "Test2"];

    	function sendCommand() {
    		// @ts-ignore
    		let message = document.getElementById("console-input").value;

    		// @ts-ignore
    		document.getElementById("console-input").value = "";

    		$$invalidate(0, messages = [...messages, message]);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ConsoleContent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = function () {
    		sendCommand();
    	};

    	const submit_handler = function (event) {
    		event.preventDefault();
    		sendCommand();
    	};

    	$$self.$capture_state = () => ({
    		TopNavigation,
    		Check,
    		Icon,
    		messages,
    		sendCommand
    	});

    	$$self.$inject_state = $$props => {
    		if ('messages' in $$props) $$invalidate(0, messages = $$props.messages);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [messages, sendCommand, click_handler, submit_handler];
    }

    class ConsoleContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConsoleContent",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const SaveStates = {
        saved: 0,
        saving: 1,
        need_to_save: 2,
        not_saved: 3
    };

    /* src\components\application\options\OptionsContent.svelte generated by Svelte v3.46.3 */
    const file$3 = "src\\components\\application\\options\\OptionsContent.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (15:16) {#if options.length > 0}
    function create_if_block_1$1(ctx) {
    	let div;
    	let button;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_if_block_3$1, create_if_block_4$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*saveStatus*/ ctx[0] === SaveStates.need_to_save) return 0;
    		if (/*saveStatus*/ ctx[0] === SaveStates.saving) return 1;
    		if (/*saveStatus*/ ctx[0] === SaveStates.saved) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			if (if_block) if_block.c();
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:bg-green-700");
    			add_location(button, file$3, 16, 24, 888);
    			attr_dev(div, "class", "text-right mt-2");
    			add_location(div, file$3, 15, 20, 833);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(button, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (if_block) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(15:16) {#if options.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (22:70) 
    function create_if_block_4$1(ctx) {
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: { src: Check, class: "-ml-1 mr-2 h-5 w-5" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t = text("Saved");
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t, anchor);
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
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(22:70) ",
    		ctx
    	});

    	return block;
    }

    // (20:71) 
    function create_if_block_3$1(ctx) {
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: {
    				src: Refresh,
    				class: "-ml-1 mr-2 h-5 w-5 service-button-loading"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t = text("Saving");
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t, anchor);
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
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(20:71) ",
    		ctx
    	});

    	return block;
    }

    // (18:28) {#if saveStatus === SaveStates.need_to_save}
    function create_if_block_2$1(ctx) {
    	let icon;
    	let t;
    	let current;

    	icon = new Icon({
    			props: { src: Save, class: "-ml-1 mr-2 h-5 w-5" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    			t = text("Save");
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert_dev(target, t, anchor);
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
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(18:28) {#if saveStatus === SaveStates.need_to_save}",
    		ctx
    	});

    	return block;
    }

    // (48:12) {:else}
    function create_else_block$1(ctx) {
    	let div1;
    	let dl;
    	let div0;
    	let dt;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			dl = element("dl");
    			div0 = element("div");
    			dt = element("dt");
    			dt.textContent = "This Application has no options";
    			attr_dev(dt, "class", "text-sm font-medium text-gray-500 dark:text-white");
    			add_location(dt, file$3, 51, 28, 3486);
    			attr_dev(div0, "class", "bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div0, file$3, 50, 24, 3365);
    			add_location(dl, file$3, 49, 20, 3335);
    			attr_dev(div1, "class", "ml-4 mb-4 border-t border-gray-200 dark:border-gray-850");
    			add_location(div1, file$3, 48, 16, 3244);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, dl);
    			append_dev(dl, div0);
    			append_dev(div0, dt);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(48:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:12) {#if options.length > 0}
    function create_if_block$2(ctx) {
    	let div;
    	let current;
    	let each_value = /*options*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4");
    			add_location(div, file$3, 29, 16, 1804);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Pencil, options, Database*/ 2) {
    				each_value = /*options*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(29:12) {#if options.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (31:20) {#each options as option}
    function create_each_block$1(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let icon0;
    	let t0;
    	let div2;
    	let div1;
    	let t1_value = /*option*/ ctx[2].name + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*option*/ ctx[2].value + "";
    	let t3;
    	let t4;
    	let div3;
    	let icon1;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { src: Database, size: "26" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { src: Pencil, size: "24" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			create_component(icon0.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			create_component(icon1.$$.fragment);
    			t5 = space();
    			attr_dev(div0, "class", "cursor-pointer mr-2 text-green-500 w-12 h-12 flex justify-center items-center");
    			add_location(div0, file$3, 33, 32, 2103);
    			attr_dev(div1, "class", "font-medium text-xlss text-gray-800 dark:text-gray-300");
    			add_location(div1, file$3, 37, 36, 2383);
    			attr_dev(p, "class", "mt-1 bg-transparent focus:outline-0 font-bold text-xls text-gray-800 dark:text-gray-300");
    			add_location(p, file$3, 38, 36, 2508);
    			add_location(div2, file$3, 36, 32, 2340);
    			attr_dev(div3, "class", "ml-auto mr-4 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-blue-600 dark:bg-gray-900 text-blue-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg");
    			add_location(div3, file$3, 40, 32, 2699);
    			attr_dev(div4, "class", "flex");
    			add_location(div4, file$3, 32, 28, 2051);
    			attr_dev(div5, "class", "bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2");
    			add_location(div5, file$3, 31, 24, 1946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			mount_component(icon0, div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);
    			append_dev(div2, p);
    			append_dev(p, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			mount_component(icon1, div3, null);
    			append_dev(div5, t5);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div3, "click", click_handler$1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(31:20) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let topnavigation;
    	let t0;
    	let div1;
    	let div0;
    	let h3;
    	let t2;
    	let p;
    	let t4;
    	let t5;
    	let current_block_type_index;
    	let if_block1;
    	let current;

    	topnavigation = new TopNavigation({
    			props: { title: "Options" },
    			$$inline: true
    		});

    	let if_block0 = /*options*/ ctx[1].length > 0 && create_if_block_1$1(ctx);
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*options*/ ctx[1].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Application Options";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Here you can change the options of the application";
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if_block1.c();
    			attr_dev(h3, "class", "text-lg leading-6 font-medium text-gray-900 dark:text-white");
    			add_location(h3, file$3, 12, 16, 534);
    			attr_dev(p, "class", "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400");
    			add_location(p, file$3, 13, 16, 648);
    			attr_dev(div0, "class", "px-4 py-5 sm:px-6");
    			add_location(div0, file$3, 11, 12, 485);
    			attr_dev(div1, "class", "overflow-y-scroll mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg");
    			add_location(div1, file$3, 10, 8, 373);
    			attr_dev(div2, "class", "content-container");
    			add_location(div2, file$3, 7, 0, 290);
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
    			append_dev(div0, h3);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(div0, t4);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div1, t5);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*options*/ ctx[1].length > 0) if_block0.p(ctx, dirty);
    			if_block1.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(topnavigation);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
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

    const click_handler$1 = function () {
    	
    };

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OptionsContent', slots, []);
    	let saveStatus = SaveStates.saved;
    	let options = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OptionsContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		TopNavigation,
    		SaveStates,
    		Check,
    		Database,
    		Icon,
    		Pencil,
    		Refresh,
    		Save,
    		saveStatus,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('saveStatus' in $$props) $$invalidate(0, saveStatus = $$props.saveStatus);
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [saveStatus, options];
    }

    class OptionsContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OptionsContent",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\application\access\AccessContent.svelte generated by Svelte v3.46.3 */
    const file$2 = "src\\components\\application\\access\\AccessContent.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (34:12) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let dl;
    	let div0;
    	let dt;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			dl = element("dl");
    			div0 = element("div");
    			dt = element("dt");
    			dt.textContent = "This Application has no added users";
    			attr_dev(dt, "class", "text-sm font-medium text-gray-500 dark:text-white");
    			add_location(dt, file$2, 37, 28, 2562);
    			attr_dev(div0, "class", "bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6");
    			add_location(div0, file$2, 36, 24, 2441);
    			add_location(dl, file$2, 35, 20, 2411);
    			attr_dev(div1, "class", "ml-4 mb-4 border-t border-gray-200 dark:border-gray-850");
    			add_location(div1, file$2, 34, 16, 2320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, dl);
    			append_dev(dl, div0);
    			append_dev(div0, dt);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(34:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:12) {#if users.length > 0}
    function create_if_block$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*users*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4");
    			add_location(div, file$2, 16, 16, 827);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Trash, Pencil, users*/ 1) {
    				each_value = /*users*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(16:12) {#if users.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (18:20) {#each users as user}
    function create_each_block(ctx) {
    	let div5;
    	let div4;
    	let div1;
    	let div0;
    	let t0_value = /*user*/ ctx[3].username + "";
    	let t0;
    	let t1;
    	let div2;
    	let icon0;
    	let t2;
    	let div3;
    	let icon1;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { src: Pencil, size: "24" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { src: Trash, size: "24" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div2 = element("div");
    			create_component(icon0.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(icon1.$$.fragment);
    			t3 = space();
    			attr_dev(div0, "class", "font-medium lg:text-xls sm:text-xs text-gray-800 dark:text-gray-300");
    			add_location(div0, file$2, 21, 36, 1211);
    			attr_dev(div1, "class", "ml-4 flex justify-center items-center");
    			add_location(div1, file$2, 20, 32, 1122);
    			attr_dev(div2, "class", "ml-auto mr-0 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-blue-600 dark:bg-gray-900 text-blue-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg");
    			add_location(div2, file$2, 23, 32, 1387);
    			attr_dev(div3, "class", "ml-2 mr-4 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-red-600 dark:bg-gray-900 text-red-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg");
    			add_location(div3, file$2, 26, 32, 1781);
    			attr_dev(div4, "class", "flex");
    			add_location(div4, file$2, 19, 28, 1070);
    			attr_dev(div5, "class", "bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2");
    			add_location(div5, file$2, 18, 24, 965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			mount_component(icon0, div2, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			mount_component(icon1, div3, null);
    			append_dev(div5, t3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div3, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(18:20) {#each users as user}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div4;
    	let topnavigation;
    	let t0;
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let t2;
    	let p;
    	let t4;
    	let current_block_type_index;
    	let if_block;
    	let t5;
    	let form;
    	let input;
    	let t6;
    	let div1;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	topnavigation = new TopNavigation({
    			props: { title: "Access" },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*users*/ ctx[0].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	icon = new Icon({
    			props: {
    				src: Plus,
    				size: "26",
    				class: "text-green-500 mx-2 dark:text-primary cursor-pointer"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Application Access";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Here you can specify with user can access your application";
    			t4 = space();
    			if_block.c();
    			t5 = space();
    			form = element("form");
    			input = element("input");
    			t6 = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(h3, "class", "text-lg leading-6 font-medium text-gray-900 dark:text-white");
    			add_location(h3, file$2, 12, 16, 511);
    			attr_dev(p, "class", "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400");
    			add_location(p, file$2, 13, 16, 624);
    			attr_dev(div0, "class", "px-4 py-5 sm:px-6");
    			add_location(div0, file$2, 11, 12, 462);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "access-input");
    			attr_dev(input, "placeholder", "Enter username...");
    			attr_dev(input, "class", "bottom-bar-input");
    			add_location(input, file$2, 43, 16, 2887);
    			add_location(div1, file$2, 44, 16, 3001);
    			attr_dev(form, "class", "bottom-bar");
    			add_location(form, file$2, 42, 12, 2780);
    			attr_dev(div2, "class", "mr-9 ml-9 mt-9 mb-9 mb-24 bg-white dark:bg-gray-900 rounded-lg shadow-lg");
    			add_location(div2, file$2, 10, 8, 362);
    			attr_dev(div3, "class", "content-list");
    			add_location(div3, file$2, 9, 4, 326);
    			attr_dev(div4, "class", "content-container");
    			add_location(div4, file$2, 7, 0, 250);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			mount_component(topnavigation, div4, null);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    			append_dev(div2, t4);
    			if_blocks[current_block_type_index].m(div2, null);
    			append_dev(div2, t5);
    			append_dev(div2, form);
    			append_dev(form, input);
    			append_dev(form, t6);
    			append_dev(form, div1);
    			mount_component(icon, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[1], false, false, false),
    					listen_dev(form, "submit", /*submit_handler*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(topnavigation);
    			if_blocks[current_block_type_index].d();
    			destroy_component(icon);
    			mounted = false;
    			run_all(dispose);
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

    function addUser() {
    	
    }

    const click_handler = function () {
    	
    };

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AccessContent', slots, []);
    	let users = [{ username: "HttpRafa" }, { username: "MainSkript" }];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AccessContent> was created with unknown prop '${key}'`);
    	});

    	const click_handler_1 = function () {
    	};

    	const submit_handler = function (event) {
    		event.preventDefault();
    	};

    	$$self.$capture_state = () => ({
    		TopNavigation,
    		Icon,
    		Plus,
    		Pencil,
    		Trash,
    		users,
    		addUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('users' in $$props) $$invalidate(0, users = $$props.users);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [users, click_handler_1, submit_handler];
    }

    class AccessContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AccessContent",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\application\files\FilesContent.svelte generated by Svelte v3.46.3 */
    const file$1 = "src\\components\\application\\files\\FilesContent.svelte";

    function create_fragment$1(ctx) {
    	let div9;
    	let topnavigation;
    	let t0;
    	let div8;
    	let div7;
    	let div0;
    	let h3;
    	let t2;
    	let p0;
    	let t4;
    	let div6;
    	let div5;
    	let div4;
    	let div1;
    	let icon;
    	let t5;
    	let div3;
    	let div2;
    	let t7;
    	let p1;
    	let current;

    	topnavigation = new TopNavigation({
    			props: { title: "Files" },
    			$$inline: true
    		});

    	icon = new Icon({
    			props: { src: Folder, size: "26" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			create_component(topnavigation.$$.fragment);
    			t0 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Application Files";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "With this information you can access your files";
    			t4 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "FTP Server";
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "No information to display";
    			attr_dev(h3, "class", "text-lg leading-6 font-medium text-gray-900 dark:text-white");
    			add_location(h3, file$1, 9, 16, 397);
    			attr_dev(p0, "class", "mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400");
    			add_location(p0, file$1, 10, 16, 509);
    			attr_dev(div0, "class", "px-4 py-5 sm:px-6");
    			add_location(div0, file$1, 8, 12, 348);
    			attr_dev(div1, "class", "cursor-pointer mr-2 text-green-500 w-12 h-12 flex justify-center items-center");
    			add_location(div1, file$1, 15, 24, 889);
    			attr_dev(div2, "class", "font-medium lg:text-xls sm:text-xs text-gray-800 dark:text-gray-300");
    			add_location(div2, file$1, 19, 28, 1135);
    			attr_dev(p1, "class", "mt-1 bg-transparent focus:outline-0 font-bold lg:text-lg sm:text-xs text-gray-800 dark:text-gray-300");
    			add_location(p1, file$1, 20, 28, 1262);
    			add_location(div3, file$1, 18, 24, 1100);
    			attr_dev(div4, "class", "flex");
    			add_location(div4, file$1, 14, 20, 845);
    			attr_dev(div5, "class", "bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2");
    			add_location(div5, file$1, 13, 16, 748);
    			attr_dev(div6, "class", "ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4");
    			add_location(div6, file$1, 12, 12, 661);
    			attr_dev(div7, "class", "mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg");
    			add_location(div7, file$1, 7, 8, 254);
    			attr_dev(div8, "class", "content-list");
    			add_location(div8, file$1, 6, 4, 218);
    			attr_dev(div9, "class", "content-container");
    			add_location(div9, file$1, 4, 0, 143);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			mount_component(topnavigation, div9, null);
    			append_dev(div9, t0);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div0);
    			append_dev(div0, h3);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(div7, t4);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			mount_component(icon, div1, null);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t7);
    			append_dev(div3, p1);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topnavigation.$$.fragment, local);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topnavigation.$$.fragment, local);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_component(topnavigation);
    			destroy_component(icon);
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
    	validate_slots('FilesContent', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilesContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TopNavigation, Folder, Icon });
    	return [];
    }

    class FilesContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilesContent",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.3 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (183:41) 
    function create_if_block_9(ctx) {
    	let accesscontent;
    	let current;
    	accesscontent = new AccessContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(accesscontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accesscontent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accesscontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accesscontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accesscontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(183:41) ",
    		ctx
    	});

    	return block;
    }

    // (181:40) 
    function create_if_block_8(ctx) {
    	let filescontent;
    	let current;
    	filescontent = new FilesContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(filescontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filescontent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filescontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filescontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filescontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(181:40) ",
    		ctx
    	});

    	return block;
    }

    // (179:42) 
    function create_if_block_7(ctx) {
    	let consolecontent;
    	let current;
    	consolecontent = new ConsoleContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(consolecontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(consolecontent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(consolecontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(consolecontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(consolecontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(179:42) ",
    		ctx
    	});

    	return block;
    }

    // (177:42) 
    function create_if_block_6(ctx) {
    	let optionscontent;
    	let current;
    	optionscontent = new OptionsContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(optionscontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(optionscontent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(optionscontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(optionscontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(optionscontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(177:42) ",
    		ctx
    	});

    	return block;
    }

    // (175:46) 
    function create_if_block_5(ctx) {
    	let applicationcontent;
    	let current;
    	applicationcontent = new ApplicationContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(applicationcontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(applicationcontent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(applicationcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(applicationcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(applicationcontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(175:46) ",
    		ctx
    	});

    	return block;
    }

    // (173:42) 
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
    		source: "(173:42) ",
    		ctx
    	});

    	return block;
    }

    // (169:43) 
    function create_if_block_3(ctx) {
    	let registercontent;
    	let current;

    	registercontent = new RegisterContent({
    			props: {
    				changeToLoginCallback: /*func_2*/ ctx[7],
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
    		p: noop,
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
    		source: "(169:43) ",
    		ctx
    	});

    	return block;
    }

    // (165:40) 
    function create_if_block_2(ctx) {
    	let logincontent;
    	let current;

    	logincontent = new LoginContent({
    			props: {
    				changeToRegisterCallback: /*func_1*/ ctx[6],
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
    		p: noop,
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
    		source: "(165:40) ",
    		ctx
    	});

    	return block;
    }

    // (163:42) 
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
    		source: "(163:42) ",
    		ctx
    	});

    	return block;
    }

    // (161:4) {#if $pageId === PageIds.home}
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
    		source: "(161:4) {#if $pageId === PageIds.home}",
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
    			props: {
    				hideIcon: /*hideSideBarIcon*/ ctx[0],
    				iconPressed: /*func*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8,
    		create_if_block_9
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$pageId*/ ctx[1] === PageIds.home) return 0;
    		if (/*$pageId*/ ctx[1] === PageIds.loading) return 1;
    		if (/*$pageId*/ ctx[1] === PageIds.login) return 2;
    		if (/*$pageId*/ ctx[1] === PageIds.register) return 3;
    		if (/*$pageId*/ ctx[1] === PageIds.addNode) return 4;
    		if (/*$pageId*/ ctx[1] === PageIds.application) return 5;
    		if (/*$pageId*/ ctx[1] === PageIds.options) return 6;
    		if (/*$pageId*/ ctx[1] === PageIds.console) return 7;
    		if (/*$pageId*/ ctx[1] === PageIds.files) return 8;
    		if (/*$pageId*/ ctx[1] === PageIds.access) return 9;
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
    			add_location(main, file, 156, 0, 5989);
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
    			if (dirty & /*hideSideBarIcon*/ 1) sidebar_changes.hideIcon = /*hideSideBarIcon*/ ctx[0];
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

    function changePage(iconId) {
    	
    } //pageId.set(icon);

    function instance($$self, $$props, $$invalidate) {
    	let $pageId;
    	validate_store(pageId, 'pageId');
    	component_subscribe($$self, pageId, $$value => $$invalidate(1, $pageId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let hideSideBarIcon = [1, 2, 3, 4, 5, 6, 7, 8];

    	onMount(() => {
    		userData.subscribe(value => {
    			if (value.applicationId > -1) {
    				$$invalidate(0, hideSideBarIcon = []);
    				pageId.set(PageIds.application);
    			} else if (value.applicationId == -1) {
    				$$invalidate(0, hideSideBarIcon = [1, 2, 3, 4, 5]);
    			} else {
    				$$invalidate(0, hideSideBarIcon = [1, 2, 3, 4, 5, 6, 7, 8]);
    			}
    		});
    	});

    	networkManager.update(value => {
    		value.prepareManager();

    		if (value.nodeManager.nodes.length <= 0) {
    			pageId.set(PageIds.addNode);
    		} else {
    			currentNode.update(nodeId => {
    				connectToNode();
    				return nodeId;
    			});
    		}

    		return value;
    	});

    	function connectToNode() {
    		pageId.set(PageIds.loading);

    		networkManager.update(manager => {
    			manager.nodeManager.connect((result, node) => {
    				if (result == 1) {
    					if (node.hasUser()) {
    						sendClientLoginRequest();
    					} else {
    						pageId.set(PageIds.login);
    					}
    				}
    			});

    			return manager;
    		});
    	}

    	function sendClientLoginRequest() {
    		pageId.set(PageIds.loading);

    		networkManager.update(value => {
    			currentNode.update(nodeId => {
    				let node = value.nodeManager.getNodeById(nodeId);

    				node.requestLogin().then(result => {
    					if (result == 1) {
    						pageId.set(PageIds.home);

    						// TODO: Load applications and currentApplication
    						updateUserData().then(userData => {
    							
    						});
    					} else if (result == 0) {
    						node.user.delete();
    						currentError.set(new ApplicationError(ErrorIds.session_outdated, "Your session is out of date or has errors, please log in again."));
    						pageId.set(PageIds.login);
    					} else {
    						pageId.set(PageIds.login);
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
    						pageId.set(PageIds.login);
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

    	function updateUserData() {
    		return new Promise(resolve => {
    				networkManager.update(value => {
    					currentNode.update(nodeId => {
    						let node = value.nodeManager.getNodeById(nodeId);

    						node.requestUserData().then(result => {
    							userData.set(result);
    							resolve(result);
    						});

    						return nodeId;
    					});

    					return value;
    				});
    			});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func = function (iconId) {
    	};

    	const func_1 = function () {
    		pageId.set(PageIds.register);
    	};

    	const func_2 = function () {
    		pageId.set(PageIds.login);
    	};

    	$$self.$capture_state = () => ({
    		SideBar,
    		HomeContent,
    		LoadingContent,
    		LoginContent,
    		AddNodeContent,
    		RegisterContent,
    		ApplicationContent,
    		ConsoleContent,
    		OptionsContent,
    		AccessContent,
    		FilesContent,
    		PageIds,
    		ApplicationError,
    		currentError,
    		currentNode,
    		networkManager,
    		pageId,
    		userData,
    		ErrorIds,
    		onMount,
    		hideSideBarIcon,
    		connectToNode,
    		sendClientLoginRequest,
    		requestLogin,
    		createAccount,
    		addNode,
    		updateUserData,
    		changePage,
    		$pageId
    	});

    	$$self.$inject_state = $$props => {
    		if ('hideSideBarIcon' in $$props) $$invalidate(0, hideSideBarIcon = $$props.hideSideBarIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hideSideBarIcon,
    		$pageId,
    		requestLogin,
    		createAccount,
    		addNode,
    		func,
    		func_1,
    		func_2
    	];
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
