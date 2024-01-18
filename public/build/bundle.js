
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
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
    /**
     * List of attributes that should always be set through the attr method,
     * because updating them through the property setter doesn't work reliably.
     * In the example of `width`/`height`, the problem is that the setter only
     * accepts numeric values, but the attribute can also be set to a string like `50%`.
     * If this list becomes too big, rethink this approach.
     */
    const always_set_through_set_attribute = ['width', 'height'];
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
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
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
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
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

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
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
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
            flush_render_callbacks($$.after_update);
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
            ctx: [],
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
            if (!is_function(callback)) {
                return noop;
            }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
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

    /* src\components\carousel.svelte generated by Svelte v3.59.2 */

    const file$e = "src\\components\\carousel.svelte";

    function create_fragment$f(ctx) {
    	let html;
    	let meta;
    	let t0;
    	let style;
    	let t2;
    	let div7;
    	let div6;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let div0;
    	let t5;
    	let div3;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let div2;
    	let t8;
    	let div5;
    	let img2;
    	let img2_src_value;
    	let t9;
    	let div4;
    	let t11;
    	let a0;
    	let img3;
    	let img3_src_value;
    	let t12;
    	let a1;
    	let img4;
    	let img4_src_value;
    	let t13;
    	let script;

    	const block = {
    		c: function create() {
    			html = element("html");
    			meta = element("meta");
    			t0 = space();
    			style = element("style");
    			style.textContent = "* {box-sizing: border-box}\r\n  body {font-family: Verdana, sans-serif; margin: 0; padding: 0}\r\n  .c-container {\r\n    max-width: 100%;\r\n    position: relative;\r\n    overflow: hidden;\r\n    max-height: 100vh; /* Set a fixed height for the container */\r\n    object-fit: contain;\r\n  }\r\n  \r\n  .c {\r\n    display: flex;\r\n    transition: transform 0.75s ease-in-out;\r\n  }\r\n  \r\n  .c-item {\r\n    flex: 0 0 100%;\r\n    position: relative;\r\n  }\r\n  \r\n  .c-item img {\r\n    width: 100%;\r\n    height: 100vh;\r\n  }\r\n\r\n  .c-caption {\r\n    position: absolute;\r\n    bottom: 35px;\r\n    left: 0;\r\n    right: 0;\r\n    font-size: 20px;\r\n    color: white;\r\n    padding: 10px;\r\n    text-align: center;\r\n  }\r\n  \r\n  /* Next & previous buttons */\r\n  .prev, .next {\r\n    cursor: pointer;\r\n    position: absolute;\r\n    top: 50%;\r\n    width: auto;\r\n    padding: 16px;\r\n    margin-top: -22px;\r\n    color: white;\r\n    font-weight: bold;\r\n    font-size: 18px;\r\n    transition: 0.6s ease;\r\n    border-radius: 0;\r\n    user-select: none;\r\n  }\r\n  \r\n  /* Position the \"next button\" to the right */\r\n  .next {\r\n    right: 0;\r\n    border-radius: 0;\r\n  }\r\n  \r\n  /* Position the \"previous button\" to the left */\r\n  .prev {\r\n    left: 0;\r\n    border-radius: 0;\r\n  }\r\n\r\n  /* Custom button images */\r\n  .prev img, .next img {\r\n    width: 40px; /* Adjust the width and height as needed */\r\n    height: 40px;\r\n  }";
    			t2 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div1 = element("div");
    			img0 = element("img");
    			t3 = space();
    			div0 = element("div");
    			div0.textContent = "Caption for picture 1";
    			t5 = space();
    			div3 = element("div");
    			img1 = element("img");
    			t6 = space();
    			div2 = element("div");
    			div2.textContent = "Caption for picture 2";
    			t8 = space();
    			div5 = element("div");
    			img2 = element("img");
    			t9 = space();
    			div4 = element("div");
    			div4.textContent = "Caption for picture 3";
    			t11 = space();
    			a0 = element("a");
    			img3 = element("img");
    			t12 = space();
    			a1 = element("a");
    			img4 = element("img");
    			t13 = space();
    			script = element("script");
    			script.textContent = "let currentSlide = 0;\r\n  const carousel = document.querySelector(\".c\");\r\n  const carouselItems = document.querySelectorAll(\".c-item\");\r\n  const totalSlides = carouselItems.length;\r\n  \r\n  function nextSlide() {\r\n    currentSlide = (currentSlide + 1) % totalSlides;\r\n    updateCarousel();\r\n  }\r\n  \r\n  function prevSlide() {\r\n    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;\r\n    updateCarousel();\r\n  }\r\n  \r\n  function updateCarousel() {\r\n    const translateX = currentSlide * -100;\r\n    carousel.style.transform = `translateX(${translateX}%)`;\r\n  }";
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1");
    			add_location(meta, file$e, 1, 0, 18);
    			add_location(style, file$e, 2, 0, 88);
    			if (!src_url_equal(img0.src, img0_src_value = "Icons/p4.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Picture 1");
    			add_location(img0, file$e, 77, 8, 1559);
    			attr_dev(div0, "class", "c-caption");
    			add_location(div0, file$e, 78, 8, 1609);
    			attr_dev(div1, "class", "c-item");
    			add_location(div1, file$e, 76, 6, 1529);
    			if (!src_url_equal(img1.src, img1_src_value = "Icons/p2.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Picture 2");
    			add_location(img1, file$e, 81, 8, 1711);
    			attr_dev(div2, "class", "c-caption");
    			add_location(div2, file$e, 82, 8, 1761);
    			attr_dev(div3, "class", "c-item");
    			add_location(div3, file$e, 80, 6, 1681);
    			if (!src_url_equal(img2.src, img2_src_value = "Icons/p4.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Picture 3");
    			add_location(img2, file$e, 85, 8, 1863);
    			attr_dev(div4, "class", "c-caption");
    			add_location(div4, file$e, 86, 8, 1913);
    			attr_dev(div5, "class", "c-item");
    			add_location(div5, file$e, 84, 6, 1833);
    			attr_dev(div6, "class", "c");
    			add_location(div6, file$e, 75, 4, 1506);
    			if (!src_url_equal(img3.src, img3_src_value = "Icons/arrow_left.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file$e, 89, 42, 2033);
    			attr_dev(a0, "class", "prev");
    			attr_dev(a0, "onclick", "prevSlide()");
    			add_location(a0, file$e, 89, 4, 1995);
    			if (!src_url_equal(img4.src, img4_src_value = "Icons/arrow_right.png")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file$e, 90, 42, 2113);
    			attr_dev(a1, "class", "next");
    			attr_dev(a1, "onclick", "nextSlide()");
    			add_location(a1, file$e, 90, 4, 2075);
    			attr_dev(div7, "class", "c-container");
    			add_location(div7, file$e, 74, 2, 1475);
    			add_location(script, file$e, 93, 2, 2168);
    			attr_dev(html, "lang", "en");
    			add_location(html, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, html, anchor);
    			append_dev(html, meta);
    			append_dev(html, t0);
    			append_dev(html, style);
    			append_dev(html, t2);
    			append_dev(html, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div6, t5);
    			append_dev(div6, div3);
    			append_dev(div3, img1);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, img2);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div7, t11);
    			append_dev(div7, a0);
    			append_dev(a0, img3);
    			append_dev(div7, t12);
    			append_dev(div7, a1);
    			append_dev(a1, img4);
    			append_dev(html, t13);
    			append_dev(html, script);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html);
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

    function instance$f($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carousel', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\selfPortrait.svelte generated by Svelte v3.59.2 */

    const file$d = "src\\components\\selfPortrait.svelte";

    function create_fragment$e(ctx) {
    	let body;
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let h1;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "About Me";
    			t2 = space();
    			p = element("p");
    			p.textContent = "Hello, I'm Claire. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae neque\r\n                    ac justo malesuada luctus. Nullam eleifend, justo at viverra tristique, dui sapien volutpat\r\n                    nisi, et volutpat libero justo a nisl. Fusce id quam ac nisi finibus volutpat. Curabitur\r\n                    auctor felis non velit auctor tincidunt.";
    			if (!src_url_equal(img.src, img_src_value = "Icons/ClairePortrait.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Portrait of Claire");
    			attr_dev(img, "class", "profile-image svelte-1u5lim0");
    			add_location(img, file$d, 54, 12, 1328);
    			attr_dev(h1, "class", "h1-profile svelte-1u5lim0");
    			add_location(h1, file$d, 56, 16, 1465);
    			add_location(p, file$d, 57, 16, 1519);
    			attr_dev(div0, "class", "about-me svelte-1u5lim0");
    			add_location(div0, file$d, 55, 12, 1425);
    			attr_dev(div1, "class", "profile-content svelte-1u5lim0");
    			add_location(div1, file$d, 53, 8, 1285);
    			attr_dev(div2, "class", "container-profile svelte-1u5lim0");
    			add_location(div2, file$d, 52, 4, 1244);
    			attr_dev(body, "class", "body-profile svelte-1u5lim0");
    			set_style(body, "background-image", "url('Icons/totoro_banner.jpg')");
    			set_style(body, "background-attachment", "fixed");
    			set_style(body, "background-size", "100% 100%");
    			set_style(body, "background-repeat", "no-repeat");
    			add_location(body, file$d, 51, 0, 1065);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div2);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t2);
    			append_dev(div0, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
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

    function instance$e($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelfPortrait', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelfPortrait> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SelfPortrait extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelfPortrait",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\components\animations.svelte generated by Svelte v3.59.2 */

    const file$c = "src\\components\\animations.svelte";

    function create_fragment$d(ctx) {
    	let body;
    	let div27;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div26;
    	let div12;
    	let div2;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let div0;
    	let t6;
    	let div1;
    	let t8;
    	let div5;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t9;
    	let div3;
    	let t11;
    	let div4;
    	let t13;
    	let div8;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t14;
    	let div6;
    	let t16;
    	let div7;
    	let t18;
    	let div11;
    	let a3;
    	let img3;
    	let img3_src_value;
    	let t19;
    	let div9;
    	let t21;
    	let div10;
    	let t23;
    	let div25;
    	let div15;
    	let a4;
    	let img4;
    	let img4_src_value;
    	let t24;
    	let div13;
    	let t26;
    	let div14;
    	let t28;
    	let div18;
    	let a5;
    	let img5;
    	let img5_src_value;
    	let t29;
    	let div16;
    	let t31;
    	let div17;
    	let t33;
    	let div21;
    	let a6;
    	let img6;
    	let img6_src_value;
    	let t34;
    	let div19;
    	let t36;
    	let div20;
    	let t38;
    	let div24;
    	let a7;
    	let img7;
    	let img7_src_value;
    	let t39;
    	let div22;
    	let t41;
    	let div23;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div27 = element("div");
    			h1 = element("h1");
    			h1.textContent = "My Animations";
    			t1 = space();
    			p = element("p");
    			p.textContent = "These are my animations. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \r\n                Sed vitae neque ac justo malesuada luctus. Nullam eleifend, justo at viverra tristique, \r\n                dui sapien volutpat nisi, et volutpat libero justo a nisl. Fusce id quam ac nisi finibus \r\n                volutpat. Curabitur auctor felis non velit auctor tincidunt.";
    			t3 = space();
    			div26 = element("div");
    			div12 = element("div");
    			div2 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t4 = space();
    			div0 = element("div");
    			div0.textContent = "Medairorsuin";
    			t6 = space();
    			div1 = element("div");
    			div1.textContent = "An experimental, out-of-body journey through my dreamscape in different mediums";
    			t8 = space();
    			div5 = element("div");
    			a1 = element("a");
    			img1 = element("img");
    			t9 = space();
    			div3 = element("div");
    			div3.textContent = "Excessive";
    			t11 = space();
    			div4 = element("div");
    			div4.textContent = "A crazy dream I had about excessive armpit hair growth";
    			t13 = space();
    			div8 = element("div");
    			a2 = element("a");
    			img2 = element("img");
    			t14 = space();
    			div6 = element("div");
    			div6.textContent = "Priscilla";
    			t16 = space();
    			div7 = element("div");
    			div7.textContent = "The daily activities of my old roommate's pet hedgehog and her favorite toilet paper tube";
    			t18 = space();
    			div11 = element("div");
    			a3 = element("a");
    			img3 = element("img");
    			t19 = space();
    			div9 = element("div");
    			div9.textContent = "Where's my ear?";
    			t21 = space();
    			div10 = element("div");
    			div10.textContent = "A monkey that bites off more than he can chew";
    			t23 = space();
    			div25 = element("div");
    			div15 = element("div");
    			a4 = element("a");
    			img4 = element("img");
    			t24 = space();
    			div13 = element("div");
    			div13.textContent = "Metamorph";
    			t26 = space();
    			div14 = element("div");
    			div14.textContent = "Clay morphing into different things";
    			t28 = space();
    			div18 = element("div");
    			a5 = element("a");
    			img5 = element("img");
    			t29 = space();
    			div16 = element("div");
    			div16.textContent = "My Name";
    			t31 = space();
    			div17 = element("div");
    			div17.textContent = "A little old lady spells out my name through knitting";
    			t33 = space();
    			div21 = element("div");
    			a6 = element("a");
    			img6 = element("img");
    			t34 = space();
    			div19 = element("div");
    			div19.textContent = "Quinoa";
    			t36 = space();
    			div20 = element("div");
    			div20.textContent = "A hungry monster";
    			t38 = space();
    			div24 = element("div");
    			a7 = element("a");
    			img7 = element("img");
    			t39 = space();
    			div22 = element("div");
    			div22.textContent = "Rough Morning";
    			t41 = space();
    			div23 = element("div");
    			div23.textContent = "A woman having a bad hair day before leaving for work";
    			attr_dev(h1, "class", "h1-animations svelte-1xx1qf7");
    			add_location(h1, file$c, 79, 12, 2015);
    			set_style(p, "margin-left", "20%");
    			set_style(p, "margin-right", "20%");
    			add_location(p, file$c, 80, 12, 2073);
    			if (!src_url_equal(img0.src, img0_src_value = "Icons/Medairorsquin.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Medairorsuin");
    			attr_dev(img0, "class", "animation-image svelte-1xx1qf7");
    			add_location(img0, file$c, 88, 28, 2744);
    			attr_dev(a0, "href", "https://google.com");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$c, 87, 24, 2669);
    			attr_dev(div0, "class", "animations-captions svelte-1xx1qf7");
    			add_location(div0, file$c, 90, 24, 2878);
    			attr_dev(div1, "class", "animations-text-box svelte-1xx1qf7");
    			add_location(div1, file$c, 93, 24, 3011);
    			attr_dev(div2, "class", "img-container");
    			add_location(div2, file$c, 86, 20, 2616);
    			if (!src_url_equal(img1.src, img1_src_value = "Icons/Excessive.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Excessive");
    			attr_dev(img1, "class", "animation-image svelte-1xx1qf7");
    			add_location(img1, file$c, 99, 28, 3363);
    			attr_dev(a1, "href", "https://google.com");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$c, 98, 24, 3288);
    			attr_dev(div3, "class", "animations-captions svelte-1xx1qf7");
    			add_location(div3, file$c, 101, 24, 3490);
    			attr_dev(div4, "class", "animations-text-box svelte-1xx1qf7");
    			add_location(div4, file$c, 104, 24, 3620);
    			attr_dev(div5, "class", "img-container");
    			add_location(div5, file$c, 97, 20, 3235);
    			if (!src_url_equal(img2.src, img2_src_value = "Icons/Priscilla.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Priscilla");
    			attr_dev(img2, "class", "animation-image svelte-1xx1qf7");
    			add_location(img2, file$c, 110, 28, 3947);
    			attr_dev(a2, "href", "https://google.com");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$c, 109, 24, 3872);
    			attr_dev(div6, "class", "animations-captions svelte-1xx1qf7");
    			add_location(div6, file$c, 112, 24, 4074);
    			attr_dev(div7, "class", "animations-text-box svelte-1xx1qf7");
    			add_location(div7, file$c, 115, 24, 4204);
    			attr_dev(div8, "class", "img-container");
    			add_location(div8, file$c, 108, 20, 3819);
    			if (!src_url_equal(img3.src, img3_src_value = "Icons/Wheres_my_ear.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Where's my ear?");
    			attr_dev(img3, "class", "animation-image svelte-1xx1qf7");
    			add_location(img3, file$c, 121, 28, 4566);
    			attr_dev(a3, "href", "https://google.com");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$c, 120, 24, 4491);
    			attr_dev(div9, "class", "animations-captions svelte-1xx1qf7");
    			add_location(div9, file$c, 123, 24, 4703);
    			attr_dev(div10, "class", "animations-text-box svelte-1xx1qf7");
    			add_location(div10, file$c, 126, 24, 4839);
    			attr_dev(div11, "class", "img-container");
    			add_location(div11, file$c, 119, 20, 4438);
    			attr_dev(div12, "class", "animations-image-row svelte-1xx1qf7");
    			add_location(div12, file$c, 85, 16, 2560);
    			if (!src_url_equal(img4.src, img4_src_value = "Icons/Metamorph.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Metamorph");
    			attr_dev(img4, "class", "animation-image svelte-1xx1qf7");
    			add_location(img4, file$c, 134, 28, 5233);
    			attr_dev(a4, "href", "https://google.com");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$c, 133, 24, 5158);
    			attr_dev(div13, "class", "animations-captions svelte-1xx1qf7");
    			add_location(div13, file$c, 136, 24, 5360);
    			attr_dev(div14, "class", "animations-text-box svelte-1xx1qf7");
    			add_location(div14, file$c, 139, 24, 5490);
    			attr_dev(div15, "class", "img-container");
    			add_location(div15, file$c, 132, 20, 5105);
    			if (!src_url_equal(img5.src, img5_src_value = "Icons/My_Name.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "My Name");
    			attr_dev(img5, "class", "animation-image svelte-1xx1qf7");
    			add_location(img5, file$c, 145, 28, 5798);
    			attr_dev(a5, "href", "https://google.com");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$c, 144, 24, 5723);
    			attr_dev(div16, "class", "animations-captions svelte-1xx1qf7");
    			add_location(div16, file$c, 147, 24, 5921);
    			attr_dev(div17, "class", "animations-text-box svelte-1xx1qf7");
    			add_location(div17, file$c, 150, 24, 6049);
    			attr_dev(div18, "class", "img-container");
    			add_location(div18, file$c, 143, 20, 5670);
    			if (!src_url_equal(img6.src, img6_src_value = "Icons/Quinoa.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Quinoa");
    			attr_dev(img6, "class", "animation-image svelte-1xx1qf7");
    			add_location(img6, file$c, 156, 28, 6375);
    			attr_dev(a6, "href", "https://google.com");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file$c, 155, 24, 6300);
    			attr_dev(div19, "class", "animations-captions svelte-1xx1qf7");
    			add_location(div19, file$c, 158, 24, 6496);
    			attr_dev(div20, "class", "animations-text-box svelte-1xx1qf7");
    			add_location(div20, file$c, 161, 24, 6623);
    			attr_dev(div21, "class", "img-container");
    			add_location(div21, file$c, 154, 20, 6247);
    			if (!src_url_equal(img7.src, img7_src_value = "Icons/Rough_Morning.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "Rough Morning");
    			attr_dev(img7, "class", "animation-image svelte-1xx1qf7");
    			add_location(img7, file$c, 167, 28, 6912);
    			attr_dev(a7, "href", "https://google.com");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file$c, 166, 24, 6837);
    			attr_dev(div22, "class", "animations-captions svelte-1xx1qf7");
    			add_location(div22, file$c, 169, 24, 7047);
    			attr_dev(div23, "class", "animations-text-box svelte-1xx1qf7");
    			add_location(div23, file$c, 172, 24, 7181);
    			attr_dev(div24, "class", "img-container");
    			add_location(div24, file$c, 165, 20, 6784);
    			attr_dev(div25, "class", "animations-image-row svelte-1xx1qf7");
    			add_location(div25, file$c, 131, 16, 5049);
    			attr_dev(div26, "class", "animation-images svelte-1xx1qf7");
    			add_location(div26, file$c, 84, 12, 2512);
    			attr_dev(div27, "class", "animations-section svelte-1xx1qf7");
    			add_location(div27, file$c, 78, 8, 1969);
    			attr_dev(body, "class", "body-animations svelte-1xx1qf7");
    			add_location(body, file$c, 77, 0, 1929);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div27);
    			append_dev(div27, h1);
    			append_dev(div27, t1);
    			append_dev(div27, p);
    			append_dev(div27, t3);
    			append_dev(div27, div26);
    			append_dev(div26, div12);
    			append_dev(div12, div2);
    			append_dev(div2, a0);
    			append_dev(a0, img0);
    			append_dev(div2, t4);
    			append_dev(div2, div0);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div12, t8);
    			append_dev(div12, div5);
    			append_dev(div5, a1);
    			append_dev(a1, img1);
    			append_dev(div5, t9);
    			append_dev(div5, div3);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div12, t13);
    			append_dev(div12, div8);
    			append_dev(div8, a2);
    			append_dev(a2, img2);
    			append_dev(div8, t14);
    			append_dev(div8, div6);
    			append_dev(div8, t16);
    			append_dev(div8, div7);
    			append_dev(div12, t18);
    			append_dev(div12, div11);
    			append_dev(div11, a3);
    			append_dev(a3, img3);
    			append_dev(div11, t19);
    			append_dev(div11, div9);
    			append_dev(div11, t21);
    			append_dev(div11, div10);
    			append_dev(div26, t23);
    			append_dev(div26, div25);
    			append_dev(div25, div15);
    			append_dev(div15, a4);
    			append_dev(a4, img4);
    			append_dev(div15, t24);
    			append_dev(div15, div13);
    			append_dev(div15, t26);
    			append_dev(div15, div14);
    			append_dev(div25, t28);
    			append_dev(div25, div18);
    			append_dev(div18, a5);
    			append_dev(a5, img5);
    			append_dev(div18, t29);
    			append_dev(div18, div16);
    			append_dev(div18, t31);
    			append_dev(div18, div17);
    			append_dev(div25, t33);
    			append_dev(div25, div21);
    			append_dev(div21, a6);
    			append_dev(a6, img6);
    			append_dev(div21, t34);
    			append_dev(div21, div19);
    			append_dev(div21, t36);
    			append_dev(div21, div20);
    			append_dev(div25, t38);
    			append_dev(div25, div24);
    			append_dev(div24, a7);
    			append_dev(a7, img7);
    			append_dev(div24, t39);
    			append_dev(div24, div22);
    			append_dev(div24, t41);
    			append_dev(div24, div23);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
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

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Animations', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Animations> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Animations extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Animations",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    function getTransitionDuration(element) {
      if (!element) return 0;

      // Get transition-duration of the element
      let { transitionDuration, transitionDelay } =
        window.getComputedStyle(element);

      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];

      return (
        (Number.parseFloat(transitionDuration) +
          Number.parseFloat(transitionDelay)) *
        1000
      );
    }

    function collapseOut(node, params) {
      const dimension = params.horizontal ? 'width' : 'height';
      node.style[dimension] = `${node.getBoundingClientRect()[dimension]}px`;
      node.classList.add('collapsing');
      node.classList.remove('collapse', 'show');
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t > 0) {
            node.style[dimension] = '';
          } else if (t === 0) {
            node.classList.remove('collapsing');
            node.classList.add('collapse');
          }
        }
      };
    }

    function collapseIn(node, params) {
      const horizontal = params.horizontal;
      const dimension = horizontal ? 'width' : 'height';
      node.classList.add('collapsing');
      node.classList.remove('collapse', 'show');
      node.style[dimension] = 0;
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t < 1) {
            if (horizontal) {
              node.style.width = `${node.scrollWidth}px`;
            } else {
              node.style.height = `${node.scrollHeight}px`;
            }
          } else {
            node.classList.remove('collapsing');
            node.classList.add('collapse', 'show');
            node.style[dimension] = '';
          }
        }
      };
    }

    const defaultToggleEvents = ['touchstart', 'click'];

    var toggle = (toggler, togglerFn) => {
      let unbindEvents;

      if (
        typeof toggler === 'string' &&
        typeof window !== 'undefined' &&
        document &&
        document.createElement
      ) {
        let selection = document.querySelectorAll(toggler);
        if (!selection.length) {
          selection = document.querySelectorAll(`#${toggler}`);
        }
        if (!selection.length) {
          throw new Error(
            `The target '${toggler}' could not be identified in the dom, tip: check spelling`
          );
        }

        defaultToggleEvents.forEach((event) => {
          selection.forEach((element) => {
            element.addEventListener(event, togglerFn);
          });
        });

        unbindEvents = () => {
          defaultToggleEvents.forEach((event) => {
            selection.forEach((element) => {
              element.removeEventListener(event, togglerFn);
            });
          });
        };
      }

      return () => {
        if (typeof unbindEvents === 'function') {
          unbindEvents();
          unbindEvents = undefined;
        }
      };
    };

    /* node_modules\sveltestrap\src\Collapse.svelte generated by Svelte v3.59.2 */
    const file$b = "node_modules\\sveltestrap\\src\\Collapse.svelte";

    // (63:0) {#if isOpen}
    function create_if_block$1(ctx) {
    	let div;
    	let div_style_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let div_levels = [
    		{
    			style: div_style_value = /*navbar*/ ctx[2] ? undefined : 'overflow: hidden;'
    		},
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[8] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$b, 63, 2, 1564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "introstart", /*introstart_handler*/ ctx[17], false, false, false, false),
    					listen_dev(div, "introend", /*introend_handler*/ ctx[18], false, false, false, false),
    					listen_dev(div, "outrostart", /*outrostart_handler*/ ctx[19], false, false, false, false),
    					listen_dev(div, "outroend", /*outroend_handler*/ ctx[20], false, false, false, false),
    					listen_dev(
    						div,
    						"introstart",
    						function () {
    							if (is_function(/*onEntering*/ ctx[3])) /*onEntering*/ ctx[3].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"introend",
    						function () {
    							if (is_function(/*onEntered*/ ctx[4])) /*onEntered*/ ctx[4].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"outrostart",
    						function () {
    							if (is_function(/*onExiting*/ ctx[5])) /*onExiting*/ ctx[5].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div,
    						"outroend",
    						function () {
    							if (is_function(/*onExited*/ ctx[6])) /*onExited*/ ctx[6].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*navbar*/ 4 && div_style_value !== (div_style_value = /*navbar*/ ctx[2] ? undefined : 'overflow: hidden;')) && { style: div_style_value },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 256) && { class: /*classes*/ ctx[8] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, collapseIn, { horizontal: /*horizontal*/ ctx[1] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, collapseOut, { horizontal: /*horizontal*/ ctx[1] });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(63:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[21]);
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$1(ctx);

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
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", /*onwindowresize*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$c($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"isOpen","class","horizontal","navbar","onEntering","onEntered","onExiting","onExited","expand","toggler"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Collapse', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { isOpen = false } = $$props;
    	let { class: className = '' } = $$props;
    	let { horizontal = false } = $$props;
    	let { navbar = false } = $$props;
    	let { onEntering = () => dispatch('opening') } = $$props;
    	let { onEntered = () => dispatch('open') } = $$props;
    	let { onExiting = () => dispatch('closing') } = $$props;
    	let { onExited = () => dispatch('close') } = $$props;
    	let { expand = false } = $$props;
    	let { toggler = null } = $$props;

    	onMount(() => toggle(toggler, e => {
    		$$invalidate(0, isOpen = !isOpen);
    		e.preventDefault();
    	}));

    	let windowWidth = 0;
    	let _wasMaximized = false;

    	// TODO wrong to hardcode these here - come from Bootstrap CSS only
    	const minWidth = {};

    	minWidth['xs'] = 0;
    	minWidth['sm'] = 576;
    	minWidth['md'] = 768;
    	minWidth['lg'] = 992;
    	minWidth['xl'] = 1200;

    	function notify() {
    		dispatch('update', isOpen);
    	}

    	function introstart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function introend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function outrostart_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function outroend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(7, windowWidth = window.innerWidth);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('horizontal' in $$new_props) $$invalidate(1, horizontal = $$new_props.horizontal);
    		if ('navbar' in $$new_props) $$invalidate(2, navbar = $$new_props.navbar);
    		if ('onEntering' in $$new_props) $$invalidate(3, onEntering = $$new_props.onEntering);
    		if ('onEntered' in $$new_props) $$invalidate(4, onEntered = $$new_props.onEntered);
    		if ('onExiting' in $$new_props) $$invalidate(5, onExiting = $$new_props.onExiting);
    		if ('onExited' in $$new_props) $$invalidate(6, onExited = $$new_props.onExited);
    		if ('expand' in $$new_props) $$invalidate(11, expand = $$new_props.expand);
    		if ('toggler' in $$new_props) $$invalidate(12, toggler = $$new_props.toggler);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		collapseIn,
    		collapseOut,
    		classnames,
    		toggle,
    		dispatch,
    		isOpen,
    		className,
    		horizontal,
    		navbar,
    		onEntering,
    		onEntered,
    		onExiting,
    		onExited,
    		expand,
    		toggler,
    		windowWidth,
    		_wasMaximized,
    		minWidth,
    		notify,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('horizontal' in $$props) $$invalidate(1, horizontal = $$new_props.horizontal);
    		if ('navbar' in $$props) $$invalidate(2, navbar = $$new_props.navbar);
    		if ('onEntering' in $$props) $$invalidate(3, onEntering = $$new_props.onEntering);
    		if ('onEntered' in $$props) $$invalidate(4, onEntered = $$new_props.onEntered);
    		if ('onExiting' in $$props) $$invalidate(5, onExiting = $$new_props.onExiting);
    		if ('onExited' in $$props) $$invalidate(6, onExited = $$new_props.onExited);
    		if ('expand' in $$props) $$invalidate(11, expand = $$new_props.expand);
    		if ('toggler' in $$props) $$invalidate(12, toggler = $$new_props.toggler);
    		if ('windowWidth' in $$props) $$invalidate(7, windowWidth = $$new_props.windowWidth);
    		if ('_wasMaximized' in $$props) $$invalidate(13, _wasMaximized = $$new_props._wasMaximized);
    		if ('classes' in $$props) $$invalidate(8, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, horizontal, navbar*/ 1030) {
    			$$invalidate(8, classes = classnames(className, {
    				'collapse-horizontal': horizontal,
    				'navbar-collapse': navbar
    			}));
    		}

    		if ($$self.$$.dirty & /*navbar, expand, windowWidth, minWidth, isOpen, _wasMaximized*/ 26757) {
    			if (navbar && expand) {
    				if (windowWidth >= minWidth[expand] && !isOpen) {
    					$$invalidate(0, isOpen = true);
    					$$invalidate(13, _wasMaximized = true);
    					notify();
    				} else if (windowWidth < minWidth[expand] && _wasMaximized) {
    					$$invalidate(0, isOpen = false);
    					$$invalidate(13, _wasMaximized = false);
    					notify();
    				}
    			}
    		}
    	};

    	return [
    		isOpen,
    		horizontal,
    		navbar,
    		onEntering,
    		onEntered,
    		onExiting,
    		onExited,
    		windowWidth,
    		classes,
    		$$restProps,
    		className,
    		expand,
    		toggler,
    		_wasMaximized,
    		minWidth,
    		$$scope,
    		slots,
    		introstart_handler,
    		introend_handler,
    		outrostart_handler,
    		outroend_handler,
    		onwindowresize
    	];
    }

    class Collapse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			isOpen: 0,
    			class: 10,
    			horizontal: 1,
    			navbar: 2,
    			onEntering: 3,
    			onEntered: 4,
    			onExiting: 5,
    			onExited: 6,
    			expand: 11,
    			toggler: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Collapse",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get isOpen() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEntering() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEntering(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onEntered() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onEntered(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExiting() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExiting(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onExited() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onExited(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggler() {
    		throw new Error("<Collapse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggler(value) {
    		throw new Error("<Collapse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Container.svelte generated by Svelte v3.59.2 */
    const file$a = "node_modules\\sveltestrap\\src\\Container.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$a, 23, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	let classes;
    	const omit_props_names = ["class","sm","md","lg","xl","xxl","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	let { xxl = undefined } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('sm' in $$new_props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$new_props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$new_props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		sm,
    		md,
    		lg,
    		xl,
    		xxl,
    		fluid,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('sm' in $$props) $$invalidate(3, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(4, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(5, lg = $$new_props.lg);
    		if ('xl' in $$props) $$invalidate(6, xl = $$new_props.xl);
    		if ('xxl' in $$props) $$invalidate(7, xxl = $$new_props.xxl);
    		if ('fluid' in $$props) $$invalidate(8, fluid = $$new_props.fluid);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, sm, md, lg, xl, xxl, fluid*/ 508) {
    			$$invalidate(0, classes = classnames(className, {
    				'container-sm': sm,
    				'container-md': md,
    				'container-lg': lg,
    				'container-xl': xl,
    				'container-xxl': xxl,
    				'container-fluid': fluid,
    				container: !sm && !md && !lg && !xl && !xxl && !fluid
    			}));
    		}
    	};

    	return [classes, $$restProps, className, sm, md, lg, xl, xxl, fluid, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			class: 2,
    			sm: 3,
    			md: 4,
    			lg: 5,
    			xl: 6,
    			xxl: 7,
    			fluid: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get class() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xxl() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xxl(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fluid() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fluid(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Nav.svelte generated by Svelte v3.59.2 */
    const file$9 = "node_modules\\sveltestrap\\src\\Nav.svelte";

    function create_fragment$a(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let ul_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			add_location(ul, file$9, 41, 0, 1007);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
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

    function getVerticalClass(vertical) {
    	if (vertical === false) {
    		return false;
    	} else if (vertical === true || vertical === 'xs') {
    		return 'flex-column';
    	}

    	return `flex-${vertical}-column`;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","tabs","pills","vertical","horizontal","justified","fill","navbar","card","underline"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { tabs = false } = $$props;
    	let { pills = false } = $$props;
    	let { vertical = false } = $$props;
    	let { horizontal = '' } = $$props;
    	let { justified = false } = $$props;
    	let { fill = false } = $$props;
    	let { navbar = false } = $$props;
    	let { card = false } = $$props;
    	let { underline = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('tabs' in $$new_props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ('pills' in $$new_props) $$invalidate(4, pills = $$new_props.pills);
    		if ('vertical' in $$new_props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ('horizontal' in $$new_props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ('justified' in $$new_props) $$invalidate(7, justified = $$new_props.justified);
    		if ('fill' in $$new_props) $$invalidate(8, fill = $$new_props.fill);
    		if ('navbar' in $$new_props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ('card' in $$new_props) $$invalidate(10, card = $$new_props.card);
    		if ('underline' in $$new_props) $$invalidate(11, underline = $$new_props.underline);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		underline,
    		getVerticalClass,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('tabs' in $$props) $$invalidate(3, tabs = $$new_props.tabs);
    		if ('pills' in $$props) $$invalidate(4, pills = $$new_props.pills);
    		if ('vertical' in $$props) $$invalidate(5, vertical = $$new_props.vertical);
    		if ('horizontal' in $$props) $$invalidate(6, horizontal = $$new_props.horizontal);
    		if ('justified' in $$props) $$invalidate(7, justified = $$new_props.justified);
    		if ('fill' in $$props) $$invalidate(8, fill = $$new_props.fill);
    		if ('navbar' in $$props) $$invalidate(9, navbar = $$new_props.navbar);
    		if ('card' in $$props) $$invalidate(10, card = $$new_props.card);
    		if ('underline' in $$props) $$invalidate(11, underline = $$new_props.underline);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, navbar, horizontal, vertical, tabs, card, pills, justified, fill, underline*/ 4092) {
    			$$invalidate(0, classes = classnames(className, navbar ? 'navbar-nav' : 'nav', horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
    				'nav-tabs': tabs,
    				'card-header-tabs': card && tabs,
    				'nav-pills': pills,
    				'card-header-pills': card && pills,
    				'nav-justified': justified,
    				'nav-fill': fill,
    				'nav-underline': underline
    			}));
    		}
    	};

    	return [
    		classes,
    		$$restProps,
    		className,
    		tabs,
    		pills,
    		vertical,
    		horizontal,
    		justified,
    		fill,
    		navbar,
    		card,
    		underline,
    		$$scope,
    		slots
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			class: 2,
    			tabs: 3,
    			pills: 4,
    			vertical: 5,
    			horizontal: 6,
    			justified: 7,
    			fill: 8,
    			navbar: 9,
    			card: 10,
    			underline: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabs() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabs(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pills() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pills(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get justified() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set justified(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navbar() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navbar(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get card() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set card(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get underline() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set underline(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Navbar.svelte generated by Svelte v3.59.2 */
    const file$8 = "node_modules\\sveltestrap\\src\\Navbar.svelte";

    // (44:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(44:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:2) {#if container}
    function create_if_block(ctx) {
    	let container_1;
    	let current;

    	container_1 = new Container({
    			props: {
    				fluid: /*container*/ ctx[0] === 'fluid',
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_1_changes = {};
    			if (dirty & /*container*/ 1) container_1_changes.fluid = /*container*/ ctx[0] === 'fluid';

    			if (dirty & /*$$scope*/ 4096) {
    				container_1_changes.$$scope = { dirty, ctx };
    			}

    			container_1.$set(container_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:2) {#if container}",
    		ctx
    	});

    	return block;
    }

    // (41:4) <Container fluid={container === 'fluid'}>
    function create_default_slot$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(41:4) <Container fluid={container === 'fluid'}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let nav;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*container*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let nav_levels = [
    		/*$$restProps*/ ctx[3],
    		{ class: /*classes*/ ctx[1] },
    		{ "data-bs-theme": /*theme*/ ctx[2] }
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if_block.c();
    			set_attributes(nav, nav_data);
    			add_location(nav, file$8, 38, 0, 896);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if_blocks[current_block_type_index].m(nav, null);
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(nav, null);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*theme*/ 4) && { "data-bs-theme": /*theme*/ ctx[2] }
    			]));
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
    			if (detaching) detach_dev(nav);
    			if_blocks[current_block_type_index].d();
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

    function getExpandClass(expand) {
    	if (expand === false) {
    		return false;
    	} else if (expand === true || expand === 'xs') {
    		return 'navbar-expand';
    	}

    	return `navbar-expand-${expand}`;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let theme;
    	let classes;
    	const omit_props_names = ["class","container","color","dark","expand","fixed","light","sticky"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, ['default']);
    	setContext('navbar', { inNavbar: true });
    	let { class: className = '' } = $$props;
    	let { container = 'fluid' } = $$props;
    	let { color = '' } = $$props;
    	let { dark = false } = $$props;
    	let { expand = '' } = $$props;
    	let { fixed = '' } = $$props;
    	let { light = false } = $$props;
    	let { sticky = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('container' in $$new_props) $$invalidate(0, container = $$new_props.container);
    		if ('color' in $$new_props) $$invalidate(5, color = $$new_props.color);
    		if ('dark' in $$new_props) $$invalidate(6, dark = $$new_props.dark);
    		if ('expand' in $$new_props) $$invalidate(7, expand = $$new_props.expand);
    		if ('fixed' in $$new_props) $$invalidate(8, fixed = $$new_props.fixed);
    		if ('light' in $$new_props) $$invalidate(9, light = $$new_props.light);
    		if ('sticky' in $$new_props) $$invalidate(10, sticky = $$new_props.sticky);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		Container,
    		setContext,
    		className,
    		container,
    		color,
    		dark,
    		expand,
    		fixed,
    		light,
    		sticky,
    		getExpandClass,
    		classes,
    		theme
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('container' in $$props) $$invalidate(0, container = $$new_props.container);
    		if ('color' in $$props) $$invalidate(5, color = $$new_props.color);
    		if ('dark' in $$props) $$invalidate(6, dark = $$new_props.dark);
    		if ('expand' in $$props) $$invalidate(7, expand = $$new_props.expand);
    		if ('fixed' in $$props) $$invalidate(8, fixed = $$new_props.fixed);
    		if ('light' in $$props) $$invalidate(9, light = $$new_props.light);
    		if ('sticky' in $$props) $$invalidate(10, sticky = $$new_props.sticky);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    		if ('theme' in $$props) $$invalidate(2, theme = $$new_props.theme);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dark, light*/ 576) {
    			$$invalidate(2, theme = dark ? 'dark' : light ? 'light' : undefined);
    		}

    		if ($$self.$$.dirty & /*className, expand, color, fixed, sticky*/ 1456) {
    			$$invalidate(1, classes = classnames(className, 'navbar', getExpandClass(expand), {
    				[`bg-${color}`]: color,
    				[`fixed-${fixed}`]: fixed,
    				[`sticky-${sticky}`]: sticky
    			}));
    		}
    	};

    	return [
    		container,
    		classes,
    		theme,
    		$$restProps,
    		className,
    		color,
    		dark,
    		expand,
    		fixed,
    		light,
    		sticky,
    		slots,
    		$$scope
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			class: 4,
    			container: 0,
    			color: 5,
    			dark: 6,
    			expand: 7,
    			fixed: 8,
    			light: 9,
    			sticky: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sticky() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sticky(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavItem.svelte generated by Svelte v3.59.2 */
    const file$7 = "node_modules\\sveltestrap\\src\\NavItem.svelte";

    function create_fragment$8(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let li_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			set_attributes(li, li_data);
    			add_location(li, file$7, 10, 0, 219);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
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
    	let classes;
    	const omit_props_names = ["class","active"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavItem', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(3, active = $$new_props.active);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, active, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(3, active = $$new_props.active);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, active*/ 12) {
    			$$invalidate(0, classes = classnames(className, 'nav-item', active ? 'active' : false));
    		}
    	};

    	return [classes, $$restProps, className, active, $$scope, slots];
    }

    class NavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { class: 2, active: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get class() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavLink.svelte generated by Svelte v3.59.2 */
    const file$6 = "node_modules\\sveltestrap\\src\\NavLink.svelte";

    function create_fragment$7(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[3],
    		{ href: /*href*/ ctx[0] },
    		{ class: /*classes*/ ctx[1] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$6, 27, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[9], false, false, false, false),
    					listen_dev(a, "click", /*handleClick*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
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
    	let classes;
    	const omit_props_names = ["class","disabled","active","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavLink', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { disabled = false } = $$props;
    	let { active = false } = $$props;
    	let { href = '#' } = $$props;

    	function handleClick(e) {
    		if (disabled) {
    			e.preventDefault();
    			e.stopImmediatePropagation();
    			return;
    		}

    		if (href === '#') {
    			e.preventDefault();
    		}
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('active' in $$new_props) $$invalidate(6, active = $$new_props.active);
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		disabled,
    		active,
    		href,
    		handleClick,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('active' in $$props) $$invalidate(6, active = $$new_props.active);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, disabled, active*/ 112) {
    			$$invalidate(1, classes = classnames(className, 'nav-link', { disabled, active }));
    		}
    	};

    	return [
    		href,
    		classes,
    		handleClick,
    		$$restProps,
    		className,
    		disabled,
    		active,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			class: 4,
    			disabled: 5,
    			active: 6,
    			href: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavbarBrand.svelte generated by Svelte v3.59.2 */
    const file$5 = "node_modules\\sveltestrap\\src\\NavbarBrand.svelte";

    function create_fragment$6(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	let a_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ href: /*href*/ ctx[0] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$5, 10, 0, 192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[6], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
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

    function instance$6($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","href"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavbarBrand', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { href = '/' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, href, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('classes' in $$props) $$invalidate(1, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(1, classes = classnames(className, 'navbar-brand'));
    		}
    	};

    	return [href, classes, $$restProps, className, $$scope, slots, click_handler];
    }

    class NavbarBrand extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { class: 3, href: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarBrand",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<NavbarBrand>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<NavbarBrand>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\NavbarToggler.svelte generated by Svelte v3.59.2 */
    const file$4 = "node_modules\\sveltestrap\\src\\NavbarToggler.svelte";

    // (11:8)      
    function fallback_block(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file$4, 11, 4, 233);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(11:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);
    	let button_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$4, 9, 0, 169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
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
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavbarToggler', slots, ['default']);
    	let { class: className = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, 'navbar-toggler'));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots, click_handler];
    }

    class NavbarToggler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavbarToggler",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get class() {
    		throw new Error("<NavbarToggler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NavbarToggler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\navigation.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;

    // (37:2) <NavbarBrand href="#Top-Page" on:click={closeNavbar} style="color: #000000; font-size: 40px; font-family: Amarante" class="me-auto">
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Claire Hanel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(37:2) <NavbarBrand href=\\\"#Top-Page\\\" on:click={closeNavbar} style=\\\"color: #000000; font-size: 40px; font-family: Amarante\\\" class=\\\"me-auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (42:8) <NavLink href="#About-Me" on:click={closeNavbar} style="color: #000000; font-size: 20px; font-family: Catamaran">
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About Me");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(42:8) <NavLink href=\\\"#About-Me\\\" on:click={closeNavbar} style=\\\"color: #000000; font-size: 20px; font-family: Catamaran\\\">",
    		ctx
    	});

    	return block;
    }

    // (41:6) <NavItem>
    function create_default_slot_9(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#About-Me",
    				style: "color: #000000; font-size: 20px; font-family: Catamaran",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*closeNavbar*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(41:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (45:8) <NavLink href="#Animations" on:click={closeNavbar} style="color: #000000; font-size: 20px; font-family: Catamaran">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Animations");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(45:8) <NavLink href=\\\"#Animations\\\" on:click={closeNavbar} style=\\\"color: #000000; font-size: 20px; font-family: Catamaran\\\">",
    		ctx
    	});

    	return block;
    }

    // (44:6) <NavItem>
    function create_default_slot_7(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#Animations",
    				style: "color: #000000; font-size: 20px; font-family: Catamaran",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*closeNavbar*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(44:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (48:10) <NavLink href="#Artwork" on:click={closeNavbar} style="color: #000000; font-size: 20px; font-family: Catamaran">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Artwork");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(48:10) <NavLink href=\\\"#Artwork\\\" on:click={closeNavbar} style=\\\"color: #000000; font-size: 20px; font-family: Catamaran\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:6) <NavItem>
    function create_default_slot_5(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#Artwork",
    				style: "color: #000000; font-size: 20px; font-family: Catamaran",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*closeNavbar*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(47:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (51:8) <NavLink href="#Contact" on:click={closeNavbar} style="color: #000000; font-size: 20px; font-family: Catamaran">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Contact");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(51:8) <NavLink href=\\\"#Contact\\\" on:click={closeNavbar} style=\\\"color: #000000; font-size: 20px; font-family: Catamaran\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:6) <NavItem>
    function create_default_slot_3(ctx) {
    	let navlink;
    	let current;

    	navlink = new NavLink({
    			props: {
    				href: "#Contact",
    				style: "color: #000000; font-size: 20px; font-family: Catamaran",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink.$on("click", /*closeNavbar*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(navlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navlink_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navlink_changes.$$scope = { dirty, ctx };
    			}

    			navlink.$set(navlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(50:6) <NavItem>",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Nav navbar>
    function create_default_slot_2(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let t2;
    	let navitem3;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navitem3 = new NavItem({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    			t2 = space();
    			create_component(navitem3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(navitem3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navitem0_changes.$$scope = { dirty, ctx };
    			}

    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navitem1_changes.$$scope = { dirty, ctx };
    			}

    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navitem2_changes.$$scope = { dirty, ctx };
    			}

    			navitem2.$set(navitem2_changes);
    			const navitem3_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navitem3_changes.$$scope = { dirty, ctx };
    			}

    			navitem3.$set(navitem3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			transition_in(navitem3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			transition_out(navitem3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(navitem3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(40:4) <Nav navbar>",
    		ctx
    	});

    	return block;
    }

    // (39:2) <Collapse {isOpen} navbar style="transition: 0.75s ease;">
    function create_default_slot_1(ctx) {
    	let nav;
    	let current;

    	nav = new Nav({
    			props: {
    				navbar: true,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(nav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				nav_changes.$$scope = { dirty, ctx };
    			}

    			nav.$set(nav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(39:2) <Collapse {isOpen} navbar style=\\\"transition: 0.75s ease;\\\">",
    		ctx
    	});

    	return block;
    }

    // (36:0) <Navbar style="{isScrolled || isOpen? 'background-color: #848B79;' : 'background-color: transparent;'} position: sticky; top: 0; z-index: 1020;">
    function create_default_slot(ctx) {
    	let navbarbrand;
    	let t0;
    	let navbartoggler;
    	let t1;
    	let collapse;
    	let current;

    	navbarbrand = new NavbarBrand({
    			props: {
    				href: "#Top-Page",
    				style: "color: #000000; font-size: 40px; font-family: Amarante",
    				class: "me-auto",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navbarbrand.$on("click", /*closeNavbar*/ ctx[3]);

    	navbartoggler = new NavbarToggler({
    			props: { class: "me-2", style: "color: black" },
    			$$inline: true
    		});

    	navbartoggler.$on("click", /*toggle*/ ctx[2]);

    	collapse = new Collapse({
    			props: {
    				isOpen: /*isOpen*/ ctx[0],
    				navbar: true,
    				style: "transition: 0.75s ease;",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navbarbrand.$$.fragment);
    			t0 = space();
    			create_component(navbartoggler.$$.fragment);
    			t1 = space();
    			create_component(collapse.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbarbrand, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navbartoggler, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(collapse, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbarbrand_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navbarbrand_changes.$$scope = { dirty, ctx };
    			}

    			navbarbrand.$set(navbarbrand_changes);
    			const collapse_changes = {};
    			if (dirty & /*isOpen*/ 1) collapse_changes.isOpen = /*isOpen*/ ctx[0];

    			if (dirty & /*$$scope*/ 16) {
    				collapse_changes.$$scope = { dirty, ctx };
    			}

    			collapse.$set(collapse_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbarbrand.$$.fragment, local);
    			transition_in(navbartoggler.$$.fragment, local);
    			transition_in(collapse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbarbrand.$$.fragment, local);
    			transition_out(navbartoggler.$$.fragment, local);
    			transition_out(collapse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbarbrand, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navbartoggler, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(collapse, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(36:0) <Navbar style=\\\"{isScrolled || isOpen? 'background-color: #848B79;' : 'background-color: transparent;'} position: sticky; top: 0; z-index: 1020;\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let navbar;
    	let current;

    	navbar = new Navbar({
    			props: {
    				style: "" + ((/*isScrolled*/ ctx[1] || /*isOpen*/ ctx[0]
    				? 'background-color: #848B79;'
    				: 'background-color: transparent;') + " position: sticky; top: 0; z-index: 1020;"),
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*isScrolled, isOpen*/ 3) navbar_changes.style = "" + ((/*isScrolled*/ ctx[1] || /*isOpen*/ ctx[0]
    			? 'background-color: #848B79;'
    			: 'background-color: transparent;') + " position: sticky; top: 0; z-index: 1020;");

    			if (dirty & /*$$scope, isOpen*/ 17) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
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
    	validate_slots('Navigation', slots, []);
    	let isOpen = false;
    	let isScrolled = false;
    	const toggle = () => $$invalidate(0, isOpen = !isOpen);

    	onMount(() => {
    		const handleScroll = () => {
    			$$invalidate(1, isScrolled = window.scrollY > 0);
    			console.log("Is Scrolled:", isScrolled); // Logging the scroll status 
    		};

    		window.addEventListener('scroll', handleScroll);

    		return () => {
    			window.removeEventListener('scroll', handleScroll);
    		};
    	});

    	// Close the navbar when a link is clicked
    	const closeNavbar = () => {
    		$$invalidate(0, isOpen = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Collapse,
    		Navbar,
    		NavbarToggler,
    		NavbarBrand,
    		Nav,
    		NavItem,
    		NavLink,
    		onMount,
    		isOpen,
    		isScrolled,
    		toggle,
    		closeNavbar
    	});

    	$$self.$inject_state = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ('isScrolled' in $$props) $$invalidate(1, isScrolled = $$props.isScrolled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpen, isScrolled, toggle, closeNavbar];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\artwork.svelte generated by Svelte v3.59.2 */

    const file$3 = "src\\components\\artwork.svelte";

    function create_fragment$3(ctx) {
    	let body;
    	let div6;
    	let div0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div5;
    	let div2;
    	let div1;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t6;
    	let div4;
    	let div3;
    	let a3;
    	let img3;
    	let img3_src_value;
    	let t7;
    	let a4;
    	let img4;
    	let img4_src_value;
    	let t8;
    	let a5;
    	let img5;
    	let img5_src_value;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div6 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "My Artwork";
    			t1 = space();
    			p = element("p");
    			p.textContent = "These are my artworks. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae neque ac justo\r\n                malesuada luctus. Nullam eleifend, justo at viverra tristique, dui sapien volutpat nisi, et volutpat libero\r\n                justo a nisl. Fusce id quam ac nisi finibus volutpat. Curabitur auctor felis non velit auctor tincidunt.";
    			t3 = space();
    			div5 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t4 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t5 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t6 = space();
    			div4 = element("div");
    			div3 = element("div");
    			a3 = element("a");
    			img3 = element("img");
    			t7 = space();
    			a4 = element("a");
    			img4 = element("img");
    			t8 = space();
    			a5 = element("a");
    			img5 = element("img");
    			attr_dev(h1, "class", "h1-artwork svelte-lvv9ic");
    			add_location(h1, file$3, 68, 12, 1720);
    			add_location(p, file$3, 69, 12, 1772);
    			attr_dev(div0, "class", "artwork-section svelte-lvv9ic");
    			add_location(div0, file$3, 67, 8, 1677);
    			if (!src_url_equal(img0.src, img0_src_value = "Icons/p1.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Artwork 1");
    			attr_dev(img0, "class", "artwork-image svelte-lvv9ic");
    			add_location(img0, file$3, 77, 24, 2367);
    			attr_dev(a0, "href", "https://google.com");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$3, 76, 20, 2296);
    			if (!src_url_equal(img1.src, img1_src_value = "Icons/p1.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Artwork 1");
    			attr_dev(img1, "class", "artwork-image svelte-lvv9ic");
    			add_location(img1, file$3, 80, 24, 2548);
    			attr_dev(a1, "href", "https://google.com");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$3, 79, 20, 2477);
    			if (!src_url_equal(img2.src, img2_src_value = "Icons/p1.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Artwork 1");
    			attr_dev(img2, "class", "artwork-image svelte-lvv9ic");
    			add_location(img2, file$3, 83, 24, 2729);
    			attr_dev(a2, "href", "https://google.com");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$3, 82, 20, 2658);
    			attr_dev(div1, "class", "img-container");
    			add_location(div1, file$3, 75, 16, 2247);
    			attr_dev(div2, "class", "artwork-image-row svelte-lvv9ic");
    			add_location(div2, file$3, 74, 12, 2198);
    			if (!src_url_equal(img3.src, img3_src_value = "Icons/p1.jpg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Artwork 1");
    			attr_dev(img3, "class", "artwork-image svelte-lvv9ic");
    			add_location(img3, file$3, 90, 24, 3044);
    			attr_dev(a3, "href", "https://google.com");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$3, 89, 20, 2973);
    			if (!src_url_equal(img4.src, img4_src_value = "Icons/p1.jpg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Artwork 1");
    			attr_dev(img4, "class", "artwork-image svelte-lvv9ic");
    			add_location(img4, file$3, 93, 24, 3225);
    			attr_dev(a4, "href", "https://google.com");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$3, 92, 20, 3154);
    			if (!src_url_equal(img5.src, img5_src_value = "Icons/p1.jpg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Artwork 1");
    			attr_dev(img5, "class", "artwork-image svelte-lvv9ic");
    			add_location(img5, file$3, 96, 24, 3406);
    			attr_dev(a5, "href", "https://google.com");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$3, 95, 20, 3335);
    			attr_dev(div3, "class", "img-container");
    			add_location(div3, file$3, 88, 16, 2924);
    			attr_dev(div4, "class", "artwork-image-row svelte-lvv9ic");
    			add_location(div4, file$3, 87, 12, 2875);
    			attr_dev(div5, "class", "artwork-images svelte-lvv9ic");
    			add_location(div5, file$3, 73, 8, 2156);
    			attr_dev(div6, "class", "container-artwork svelte-lvv9ic");
    			add_location(div6, file$3, 66, 4, 1636);
    			attr_dev(body, "class", "body-artwork svelte-lvv9ic");
    			add_location(body, file$3, 65, 0, 1603);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div6);
    			append_dev(div6, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(a0, img0);
    			append_dev(div1, t4);
    			append_dev(div1, a1);
    			append_dev(a1, img1);
    			append_dev(div1, t5);
    			append_dev(div1, a2);
    			append_dev(a2, img2);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, a3);
    			append_dev(a3, img3);
    			append_dev(div3, t7);
    			append_dev(div3, a4);
    			append_dev(a4, img4);
    			append_dev(div3, t8);
    			append_dev(div3, a5);
    			append_dev(a5, img5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Artwork', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Artwork> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Artwork extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Artwork",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\contact.svelte generated by Svelte v3.59.2 */

    const file$2 = "src\\components\\contact.svelte";

    function create_fragment$2(ctx) {
    	let body;
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let form;
    	let label0;
    	let t4;
    	let input0;
    	let br0;
    	let t5;
    	let label1;
    	let t7;
    	let input1;
    	let br1;
    	let t8;
    	let label2;
    	let t10;
    	let textarea;
    	let br2;
    	let t11;
    	let input2;

    	const block = {
    		c: function create() {
    			body = element("body");
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Contact Me";
    			t2 = space();
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "Name:";
    			t4 = space();
    			input0 = element("input");
    			br0 = element("br");
    			t5 = space();
    			label1 = element("label");
    			label1.textContent = "Email:";
    			t7 = space();
    			input1 = element("input");
    			br1 = element("br");
    			t8 = space();
    			label2 = element("label");
    			label2.textContent = "Message:";
    			t10 = space();
    			textarea = element("textarea");
    			br2 = element("br");
    			t11 = space();
    			input2 = element("input");
    			if (!src_url_equal(img.src, img_src_value = "Icons/ClairePortrait.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pic of me");
    			attr_dev(img, "class", "img-contact svelte-1lgk5iu");
    			add_location(img, file$2, 38, 12, 784);
    			attr_dev(div0, "class", "left-column svelte-1lgk5iu");
    			add_location(div0, file$2, 37, 8, 745);
    			attr_dev(h1, "class", "h1-contact svelte-1lgk5iu");
    			add_location(h1, file$2, 41, 12, 922);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$2, 43, 16, 1036);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "name", "name");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-1lgk5iu");
    			add_location(input0, file$2, 44, 16, 1085);
    			add_location(br0, file$2, 44, 66, 1135);
    			attr_dev(label1, "for", "email");
    			add_location(label1, file$2, 45, 16, 1157);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "id", "email");
    			attr_dev(input1, "name", "email");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-1lgk5iu");
    			add_location(input1, file$2, 46, 16, 1208);
    			add_location(br1, file$2, 46, 69, 1261);
    			attr_dev(label2, "for", "message");
    			add_location(label2, file$2, 47, 16, 1283);
    			attr_dev(textarea, "id", "message");
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "rows", "4");
    			textarea.required = true;
    			attr_dev(textarea, "class", "svelte-1lgk5iu");
    			add_location(textarea, file$2, 48, 16, 1338);
    			add_location(br2, file$2, 48, 83, 1405);
    			attr_dev(input2, "type", "submit");
    			input2.value = "Submit";
    			attr_dev(input2, "class", "svelte-1lgk5iu");
    			add_location(input2, file$2, 49, 16, 1427);
    			attr_dev(form, "action", "contactform.py");
    			attr_dev(form, "method", "post");
    			add_location(form, file$2, 42, 12, 974);
    			attr_dev(div1, "class", "right-column svelte-1lgk5iu");
    			add_location(div1, file$2, 40, 8, 882);
    			attr_dev(div2, "class", "container-contact svelte-1lgk5iu");
    			add_location(div2, file$2, 36, 4, 704);
    			attr_dev(body, "class", "body-contact svelte-1lgk5iu");
    			add_location(body, file$2, 34, 0, 665);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, form);
    			append_dev(form, label0);
    			append_dev(form, t4);
    			append_dev(form, input0);
    			append_dev(form, br0);
    			append_dev(form, t5);
    			append_dev(form, label1);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			append_dev(form, br1);
    			append_dev(form, t8);
    			append_dev(form, label2);
    			append_dev(form, t10);
    			append_dev(form, textarea);
    			append_dev(form, br2);
    			append_dev(form, t11);
    			append_dev(form, input2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\navigation2.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\components\\navigation2.svelte";

    function create_fragment$1(ctx) {
    	let nav;
    	let a0;
    	let t1;
    	let div1;
    	let ul;
    	let li0;
    	let a1;
    	let t3;
    	let li1;
    	let a2;
    	let t5;
    	let li2;
    	let a3;
    	let t7;
    	let li3;
    	let a4;
    	let ul_class_value;
    	let t9;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_class_value;
    	let nav_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "Claire Hanel";
    			t1 = space();
    			div1 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "About Me";
    			t3 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Animations";
    			t5 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Artwork";
    			t7 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Contact";
    			t9 = space();
    			div0 = element("div");
    			img = element("img");
    			attr_dev(a0, "class", "navbar-brand svelte-14njd3b");
    			attr_dev(a0, "href", "#Top-Page");
    			add_location(a0, file$1, 144, 4, 4103);
    			attr_dev(a1, "class", "nav-link svelte-14njd3b");
    			attr_dev(a1, "href", "#About-Me");
    			add_location(a1, file$1, 147, 33, 4307);
    			attr_dev(li0, "class", "nav-item svelte-14njd3b");
    			add_location(li0, file$1, 147, 12, 4286);
    			attr_dev(a2, "class", "nav-link svelte-14njd3b");
    			attr_dev(a2, "href", "#Animations");
    			add_location(a2, file$1, 148, 33, 4419);
    			attr_dev(li1, "class", "nav-item svelte-14njd3b");
    			add_location(li1, file$1, 148, 12, 4398);
    			attr_dev(a3, "class", "nav-link svelte-14njd3b");
    			attr_dev(a3, "href", "#Artwork");
    			add_location(a3, file$1, 149, 33, 4535);
    			attr_dev(li2, "class", "nav-item svelte-14njd3b");
    			add_location(li2, file$1, 149, 12, 4514);
    			attr_dev(a4, "class", "nav-link svelte-14njd3b");
    			attr_dev(a4, "href", "#Contact");
    			add_location(a4, file$1, 150, 33, 4645);
    			attr_dev(li3, "class", "nav-item svelte-14njd3b");
    			add_location(li3, file$1, 150, 12, 4624);
    			attr_dev(ul, "class", ul_class_value = "nav-items " + (/*isOpen*/ ctx[0] ? 'nav-items-visible' : '') + " svelte-14njd3b");
    			attr_dev(ul, "id", "nav-items");
    			add_location(ul, file$1, 146, 8, 4199);

    			if (!src_url_equal(img.src, img_src_value = /*isOpen*/ ctx[0]
    			? 'Icons/x_icon.png'
    			: 'Icons/paint_brush.png')) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "class", img_class_value = "toggler-img " + (/*isOpen*/ ctx[0] ? 'transformed-toggler-img' : '') + " svelte-14njd3b");
    			attr_dev(img, "alt", "Toggler Icon");
    			add_location(img, file$1, 153, 12, 4825);
    			attr_dev(div0, "class", "navbar-toggler svelte-14njd3b");
    			attr_dev(div0, "id", "navbar-toggler");
    			add_location(div0, file$1, 152, 8, 4745);
    			attr_dev(div1, "class", "nav-group svelte-14njd3b");
    			add_location(div1, file$1, 145, 4, 4166);
    			attr_dev(nav, "class", "navbar svelte-14njd3b");
    			attr_dev(nav, "id", "navbar");

    			attr_dev(nav, "style", nav_style_value = /*isOpen*/ ctx[0] || /*isVisable*/ ctx[1]
    			? 'background-color: #848B79;'
    			: 'background-color: transparent;');

    			add_location(nav, file$1, 143, 0, 3969);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, a0);
    			append_dev(nav, t1);
    			append_dev(nav, div1);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			append_dev(div0, img);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a1, "click", /*closeNavbar*/ ctx[3], false, false, false, false),
    					listen_dev(a2, "click", /*closeNavbar*/ ctx[3], false, false, false, false),
    					listen_dev(a3, "click", /*closeNavbar*/ ctx[3], false, false, false, false),
    					listen_dev(a4, "click", /*closeNavbar*/ ctx[3], false, false, false, false),
    					listen_dev(div0, "click", /*toggle*/ ctx[2], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isOpen*/ 1 && ul_class_value !== (ul_class_value = "nav-items " + (/*isOpen*/ ctx[0] ? 'nav-items-visible' : '') + " svelte-14njd3b")) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (dirty & /*isOpen*/ 1 && !src_url_equal(img.src, img_src_value = /*isOpen*/ ctx[0]
    			? 'Icons/x_icon.png'
    			: 'Icons/paint_brush.png')) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*isOpen*/ 1 && img_class_value !== (img_class_value = "toggler-img " + (/*isOpen*/ ctx[0] ? 'transformed-toggler-img' : '') + " svelte-14njd3b")) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*isOpen, isVisable*/ 3 && nav_style_value !== (nav_style_value = /*isOpen*/ ctx[0] || /*isVisable*/ ctx[1]
    			? 'background-color: #848B79;'
    			: 'background-color: transparent;')) {
    				attr_dev(nav, "style", nav_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
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
    	validate_slots('Navigation2', slots, []);
    	let isOpen = false;
    	let isVisable = false;
    	let isScrolled = false;
    	let scrollTimeout;

    	// Function to toggle the navbar open/closed
    	function toggle() {
    		$$invalidate(0, isOpen = !isOpen);
    	}

    	onMount(() => {
    		function handleScroll() {
    			$$invalidate(1, isVisable = window.scrollY > 0);
    			clearTimeout(scrollTimeout);
    			isScrolled = true;

    			// Set a timeout to change isScrolled to false after a delay of 200ms
    			if (isScrolled) {
    				// while scrolling, close and hide navbar
    				$$invalidate(1, isVisable = false);

    				$$invalidate(0, isOpen = false);

    				// change status of isScrolled after 200ms, make navbar visible again if not at the top of the page
    				scrollTimeout = setTimeout(
    					() => {
    						isScrolled = false;
    						$$invalidate(1, isVisable = window.scrollY > 0);
    					},
    					200
    				);
    			}
    		}

    		window.addEventListener('scroll', handleScroll);

    		return () => {
    			window.removeEventListener('scroll', handleScroll);
    		};
    	});

    	// Function to close the navbar
    	function closeNavbar() {
    		$$invalidate(0, isOpen = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigation2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		isOpen,
    		isVisable,
    		isScrolled,
    		scrollTimeout,
    		toggle,
    		closeNavbar
    	});

    	$$self.$inject_state = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ('isVisable' in $$props) $$invalidate(1, isVisable = $$props.isVisable);
    		if ('isScrolled' in $$props) isScrolled = $$props.isScrolled;
    		if ('scrollTimeout' in $$props) scrollTimeout = $$props.scrollTimeout;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpen, isVisable, toggle, closeNavbar];
    }

    class Navigation2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation2",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let nav2;
    	let t0;
    	let div0;
    	let carousel;
    	let t1;
    	let div1;
    	let aboutme;
    	let t2;
    	let div2;
    	let animations;
    	let t3;
    	let div3;
    	let artwork;
    	let t4;
    	let div4;
    	let contactme;
    	let current;
    	nav2 = new Navigation2({ $$inline: true });
    	carousel = new Carousel({ $$inline: true });
    	aboutme = new SelfPortrait({ $$inline: true });
    	animations = new Animations({ $$inline: true });
    	artwork = new Artwork({ $$inline: true });
    	contactme = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(nav2.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(carousel.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(aboutme.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(animations.$$.fragment);
    			t3 = space();
    			div3 = element("div");
    			create_component(artwork.$$.fragment);
    			t4 = space();
    			div4 = element("div");
    			create_component(contactme.$$.fragment);
    			attr_dev(div0, "id", "Top-Page");
    			add_location(div0, file, 41, 4, 900);
    			attr_dev(div1, "id", "About-Me");
    			attr_dev(div1, "class", "about svelte-cvqesg");
    			add_location(div1, file, 45, 4, 974);
    			attr_dev(div2, "id", "Animations");
    			add_location(div2, file, 49, 4, 1060);
    			attr_dev(div3, "id", "Artwork");
    			add_location(div3, file, 53, 4, 1136);
    			attr_dev(div4, "id", "Contact");
    			add_location(div4, file, 57, 4, 1203);
    			set_style(main, "padding", "0em");
    			attr_dev(main, "class", "svelte-cvqesg");
    			add_location(main, file, 39, 0, 847);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(nav2, main, null);
    			append_dev(main, t0);
    			append_dev(main, div0);
    			mount_component(carousel, div0, null);
    			append_dev(main, t1);
    			append_dev(main, div1);
    			mount_component(aboutme, div1, null);
    			append_dev(main, t2);
    			append_dev(main, div2);
    			mount_component(animations, div2, null);
    			append_dev(main, t3);
    			append_dev(main, div3);
    			mount_component(artwork, div3, null);
    			append_dev(main, t4);
    			append_dev(main, div4);
    			mount_component(contactme, div4, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav2.$$.fragment, local);
    			transition_in(carousel.$$.fragment, local);
    			transition_in(aboutme.$$.fragment, local);
    			transition_in(animations.$$.fragment, local);
    			transition_in(artwork.$$.fragment, local);
    			transition_in(contactme.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav2.$$.fragment, local);
    			transition_out(carousel.$$.fragment, local);
    			transition_out(aboutme.$$.fragment, local);
    			transition_out(animations.$$.fragment, local);
    			transition_out(artwork.$$.fragment, local);
    			transition_out(contactme.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(nav2);
    			destroy_component(carousel);
    			destroy_component(aboutme);
    			destroy_component(animations);
    			destroy_component(artwork);
    			destroy_component(contactme);
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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Carousel,
    		AboutMe: SelfPortrait,
    		Animations,
    		MyNav: Navigation,
    		Artwork,
    		ContactMe: Contact,
    		Nav2: Navigation2
    	});

    	return [];
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
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
