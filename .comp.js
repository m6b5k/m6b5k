/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
  }
  
  +function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
      throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
    }
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: transition.js v3.3.6
   * http://getbootstrap.com/javascript/#transitions
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  

  +function ($) {
    'use strict';
  
    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // =========================================================
  
    function transitionEnd() {
      var el = document.createElement('bootstrap')
  
      var transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        transition       : 'transitionend'
      }
  
      for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
          return { end: transEndEventNames[name] }
        }
      }
  
      return false // explicit for ie8 (  ._.)
    }
  
    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
      var called = false
      var $el = this
      $(this).one('bsTransitionEnd', function () { called = true })
      var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
      setTimeout(callback, duration)
      return this
    }
  
    $(function () {
      $.support.transition = transitionEnd()
  
      if (!$.support.transition) return
  
      $.event.special.bsTransitionEnd = {
        bindType: $.support.transition.end,
        delegateType: $.support.transition.end,
        handle: function (e) {
          if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
        }
      }
    })
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: alert.js v3.3.6
   * http://getbootstrap.com/javascript/#alerts
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // ALERT CLASS DEFINITION
    // ======================
  
    var dismiss = '[data-dismiss="alert"]'
    var Alert   = function (el) {
      $(el).on('click', dismiss, this.close)
    }
  
    Alert.VERSION = '3.3.6'
  
    Alert.TRANSITION_DURATION = 150
  
    Alert.prototype.close = function (e) {
      var $this    = $(this)
      var selector = $this.attr('data-target')
  
      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }
  
      var $parent = $(selector)
  
      if (e) e.preventDefault()
  
      if (!$parent.length) {
        $parent = $this.closest('.alert')
      }
  
      $parent.trigger(e = $.Event('close.bs.alert'))
  
      if (e.isDefaultPrevented()) return
  
      $parent.removeClass('in')
  
      function removeElement() {
        // detach from parent, fire event then clean up data
        $parent.detach().trigger('closed.bs.alert').remove()
      }
  
      $.support.transition && $parent.hasClass('fade') ?
        $parent
          .one('bsTransitionEnd', removeElement)
          .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
        removeElement()
    }
  
  
    // ALERT PLUGIN DEFINITION
    // =======================
  
    function Plugin(option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('bs.alert')
  
        if (!data) $this.data('bs.alert', (data = new Alert(this)))
        if (typeof option == 'string') data[option].call($this)
      })
    }
  
    var old = $.fn.alert
  
    $.fn.alert             = Plugin
    $.fn.alert.Constructor = Alert
  
  
    // ALERT NO CONFLICT
    // =================
  
    $.fn.alert.noConflict = function () {
      $.fn.alert = old
      return this
    }
  
  
    // ALERT DATA-API
    // ==============
  
    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: button.js v3.3.6
   * http://getbootstrap.com/javascript/#buttons
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================
  
    var Button = function (element, options) {
      this.$element  = $(element)
      this.options   = $.extend({}, Button.DEFAULTS, options)
      this.isLoading = false
    }
  
    Button.VERSION  = '3.3.6'
  
    Button.DEFAULTS = {
      loadingText: 'loading...'
    }
  
    Button.prototype.setState = function (state) {
      var d    = 'disabled'
      var $el  = this.$element
      var val  = $el.is('input') ? 'val' : 'html'
      var data = $el.data()
  
      state += 'Text'
  
      if (data.resetText == null) $el.data('resetText', $el[val]())
  
      // push to event loop to allow forms to submit
      setTimeout($.proxy(function () {
        $el[val](data[state] == null ? this.options[state] : data[state])
  
        if (state == 'loadingText') {
          this.isLoading = true
          $el.addClass(d).attr(d, d)
        } else if (this.isLoading) {
          this.isLoading = false
          $el.removeClass(d).removeAttr(d)
        }
      }, this), 0)
    }
  
    Button.prototype.toggle = function () {
      var changed = true
      var $parent = this.$element.closest('[data-toggle="buttons"]')
  
      if ($parent.length) {
        var $input = this.$element.find('input')
        if ($input.prop('type') == 'radio') {
          if ($input.prop('checked')) changed = false
          $parent.find('.active').removeClass('active')
          this.$element.addClass('active')
        } else if ($input.prop('type') == 'checkbox') {
          if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
          this.$element.toggleClass('active')
        }
        $input.prop('checked', this.$element.hasClass('active'))
        if (changed) $input.trigger('change')
      } else {
        this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
        this.$element.toggleClass('active')
      }
    }
  
  
    // BUTTON PLUGIN DEFINITION
    // ========================
  
    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.button')
        var options = typeof option == 'object' && option
  
        if (!data) $this.data('bs.button', (data = new Button(this, options)))
  
        if (option == 'toggle') data.toggle()
        else if (option) data.setState(option)
      })
    }
  
    var old = $.fn.button
  
    $.fn.button             = Plugin
    $.fn.button.Constructor = Button
  
  
    // BUTTON NO CONFLICT
    // ==================
  
    $.fn.button.noConflict = function () {
      $.fn.button = old
      return this
    }
  
  
    // BUTTON DATA-API
    // ===============
  
    $(document)
      .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
        var $btn = $(e.target)
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
        Plugin.call($btn, 'toggle')
        if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
      })
      .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
        $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
      })
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: carousel.js v3.3.6
   * http://getbootstrap.com/javascript/#carousel
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // CAROUSEL CLASS DEFINITION
    // =========================
  
    var Carousel = function (element, options) {
      this.$element    = $(element)
      this.$indicators = this.$element.find('.carousel-indicators')
      this.options     = options
      this.paused      = null
      this.sliding     = null
      this.interval    = null
      this.$active     = null
      this.$items      = null
  
      this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))
  
      this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
        .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
        .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }
  
    Carousel.VERSION  = '3.3.6'
  
    Carousel.TRANSITION_DURATION = 600
  
    Carousel.DEFAULTS = {
      interval: 5000,
      pause: 'hover',
      wrap: true,
      keyboard: true
    }
  
    Carousel.prototype.keydown = function (e) {
      if (/input|textarea/i.test(e.target.tagName)) return
      switch (e.which) {
        case 37: this.prev(); break
        case 39: this.next(); break
        default: return
      }
  
      e.preventDefault()
    }
  
    Carousel.prototype.cycle = function (e) {
      e || (this.paused = false)
  
      this.interval && clearInterval(this.interval)
  
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
  
      return this
    }
  
    Carousel.prototype.getItemIndex = function (item) {
      this.$items = item.parent().children('.item')
      return this.$items.index(item || this.$active)
    }
  
    Carousel.prototype.getItemForDirection = function (direction, active) {
      var activeIndex = this.getItemIndex(active)
      var willWrap = (direction == 'prev' && activeIndex === 0)
                  || (direction == 'next' && activeIndex == (this.$items.length - 1))
      if (willWrap && !this.options.wrap) return active
      var delta = direction == 'prev' ? -1 : 1
      var itemIndex = (activeIndex + delta) % this.$items.length
      return this.$items.eq(itemIndex)
    }
  
    Carousel.prototype.to = function (pos) {
      var that        = this
      var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))
  
      if (pos > (this.$items.length - 1) || pos < 0) return
  
      if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
      if (activeIndex == pos) return this.pause().cycle()
  
      return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }
  
    Carousel.prototype.pause = function (e) {
      e || (this.paused = true)
  
      if (this.$element.find('.next, .prev').length && $.support.transition) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
  
      this.interval = clearInterval(this.interval)
  
      return this
    }
  
    Carousel.prototype.next = function () {
      if (this.sliding) return
      return this.slide('next')
    }
  
    Carousel.prototype.prev = function () {
      if (this.sliding) return
      return this.slide('prev')
    }
  
    Carousel.prototype.slide = function (type, next) {
      var $active   = this.$element.find('.item.active')
      var $next     = next || this.getItemForDirection(type, $active)
      var isCycling = this.interval
      var direction = type == 'next' ? 'left' : 'right'
      var that      = this
  
      if ($next.hasClass('active')) return (this.sliding = false)
  
      var relatedTarget = $next[0]
      var slideEvent = $.Event('slide.bs.carousel', {
        relatedTarget: relatedTarget,
        direction: direction
      })
      this.$element.trigger(slideEvent)
      if (slideEvent.isDefaultPrevented()) return
  
      this.sliding = true
  
      isCycling && this.pause()
  
      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
        $nextIndicator && $nextIndicator.addClass('active')
      }
  
      var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
      if ($.support.transition && this.$element.hasClass('slide')) {
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        $active
          .one('bsTransitionEnd', function () {
            $next.removeClass([type, direction].join(' ')).addClass('active')
            $active.removeClass(['active', direction].join(' '))
            that.sliding = false
            setTimeout(function () {
              that.$element.trigger(slidEvent)
            }, 0)
          })
          .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
      } else {
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger(slidEvent)
      }
  
      isCycling && this.cycle()
  
      return this
    }
  
  
    // CAROUSEL PLUGIN DEFINITION
    // ==========================
  
    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.carousel')
        var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
        var action  = typeof option == 'string' ? option : options.slide
  
        if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
        if (typeof option == 'number') data.to(option)
        else if (action) data[action]()
        else if (options.interval) data.pause().cycle()
      })
    }
  
    var old = $.fn.carousel
  
    $.fn.carousel             = Plugin
    $.fn.carousel.Constructor = Carousel
  
  
    // CAROUSEL NO CONFLICT
    // ====================
  
    $.fn.carousel.noConflict = function () {
      $.fn.carousel = old
      return this
    }
  
  
    // CAROUSEL DATA-API
    // =================
  
    var clickHandler = function (e) {
      var href
      var $this   = $(this)
      var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
      if (!$target.hasClass('carousel')) return
      var options = $.extend({}, $target.data(), $this.data())
      var slideIndex = $this.attr('data-slide-to')
      if (slideIndex) options.interval = false
  
      Plugin.call($target, options)
  
      if (slideIndex) {
        $target.data('bs.carousel').to(slideIndex)
      }
  
      e.preventDefault()
    }
  
    $(document)
      .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
      .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)
  
    $(window).on('load', function () {
      $('[data-ride="carousel"]').each(function () {
        var $carousel = $(this)
        Plugin.call($carousel, $carousel.data())
      })
    })
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: collapse.js v3.3.6
   * http://getbootstrap.com/javascript/#collapse
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================
  
    var Collapse = function (element, options) {
      this.$element      = $(element)
      this.options       = $.extend({}, Collapse.DEFAULTS, options)
      this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                             '[data-toggle="collapse"][data-target="#' + element.id + '"]')
      this.transitioning = null
  
      if (this.options.parent) {
        this.$parent = this.getParent()
      } else {
        this.addAriaAndCollapsedClass(this.$element, this.$trigger)
      }
  
      if (this.options.toggle) this.toggle()
    }
  
    Collapse.VERSION  = '3.3.6'
  
    Collapse.TRANSITION_DURATION = 350
  
    Collapse.DEFAULTS = {
      toggle: true
    }
  
    Collapse.prototype.dimension = function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }
  
    Collapse.prototype.show = function () {
      if (this.transitioning || this.$element.hasClass('in')) return
  
      var activesData
      var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')
  
      if (actives && actives.length) {
        activesData = actives.data('bs.collapse')
        if (activesData && activesData.transitioning) return
      }
  
      var startEvent = $.Event('show.bs.collapse')
      this.$element.trigger(startEvent)
      if (startEvent.isDefaultPrevented()) return
  
      if (actives && actives.length) {
        Plugin.call(actives, 'hide')
        activesData || actives.data('bs.collapse', null)
      }
  
      var dimension = this.dimension()
  
      this.$element
        .removeClass('collapse')
        .addClass('collapsing')[dimension](0)
        .attr('aria-expanded', true)
  
      this.$trigger
        .removeClass('collapsed')
        .attr('aria-expanded', true)
  
      this.transitioning = 1
  
      var complete = function () {
        this.$element
          .removeClass('collapsing')
          .addClass('collapse in')[dimension]('')
        this.transitioning = 0
        this.$element
          .trigger('shown.bs.collapse')
      }
  
      if (!$.support.transition) return complete.call(this)
  
      var scrollSize = $.camelCase(['scroll', dimension].join('-'))
  
      this.$element
        .one('bsTransitionEnd', $.proxy(complete, this))
        .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    }
  
    Collapse.prototype.hide = function () {
      if (this.transitioning || !this.$element.hasClass('in')) return
  
      var startEvent = $.Event('hide.bs.collapse')
      this.$element.trigger(startEvent)
      if (startEvent.isDefaultPrevented()) return
  
      var dimension = this.dimension()
  
      this.$element[dimension](this.$element[dimension]())[0].offsetHeight
  
      this.$element
        .addClass('collapsing')
        .removeClass('collapse in')
        .attr('aria-expanded', false)
  
      this.$trigger
        .addClass('collapsed')
        .attr('aria-expanded', false)
  
      this.transitioning = 1
  
      var complete = function () {
        this.transitioning = 0
        this.$element
          .removeClass('collapsing')
          .addClass('collapse')
          .trigger('hidden.bs.collapse')
      }
  
      if (!$.support.transition) return complete.call(this)
  
      this.$element
        [dimension](0)
        .one('bsTransitionEnd', $.proxy(complete, this))
        .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    }
  
    Collapse.prototype.toggle = function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }
  
    Collapse.prototype.getParent = function () {
      return $(this.options.parent)
        .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
        .each($.proxy(function (i, element) {
          var $element = $(element)
          this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
        }, this))
        .end()
    }
  
    Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
      var isOpen = $element.hasClass('in')
  
      $element.attr('aria-expanded', isOpen)
      $trigger
        .toggleClass('collapsed', !isOpen)
        .attr('aria-expanded', isOpen)
    }
  
    function getTargetFromTrigger($trigger) {
      var href
      var target = $trigger.attr('data-target')
        || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
  
      return $(target)
    }
  
  
    // COLLAPSE PLUGIN DEFINITION
    // ==========================
  
    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.collapse')
        var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)
  
        if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
        if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }
  
    var old = $.fn.collapse
  
    $.fn.collapse             = Plugin
    $.fn.collapse.Constructor = Collapse
  
  
    // COLLAPSE NO CONFLICT
    // ====================
  
    $.fn.collapse.noConflict = function () {
      $.fn.collapse = old
      return this
    }
  
  
    // COLLAPSE DATA-API
    // =================
  
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
      var $this   = $(this)
  
      if (!$this.attr('data-target')) e.preventDefault()
  
      var $target = getTargetFromTrigger($this)
      var data    = $target.data('bs.collapse')
      var option  = data ? 'toggle' : $this.data()
  
      Plugin.call($target, option)
    })
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: dropdown.js v3.3.6
   * http://getbootstrap.com/javascript/#dropdowns
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // DROPDOWN CLASS DEFINITION
    // =========================
  
    var backdrop = '.dropdown-backdrop'
    var toggle   = '[data-toggle="dropdown"]'
    var Dropdown = function (element) {
      $(element).on('click.bs.dropdown', this.toggle)
    }
  
    Dropdown.VERSION = '3.3.6'
  
    function getParent($this) {
      var selector = $this.attr('data-target')
  
      if (!selector) {
        selector = $this.attr('href')
        selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }
  
      var $parent = selector && $(selector)
  
      return $parent && $parent.length ? $parent : $this.parent()
    }
  
    function clearMenus(e) {
      if (e && e.which === 3) return
      $(backdrop).remove()
      $(toggle).each(function () {
        var $this         = $(this)
        var $parent       = getParent($this)
        var relatedTarget = { relatedTarget: this }
  
        if (!$parent.hasClass('open')) return
  
        if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return
  
        $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
  
        if (e.isDefaultPrevented()) return
  
        $this.attr('aria-expanded', 'false')
        $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
      })
    }
  
    Dropdown.prototype.toggle = function (e) {
      var $this = $(this)
  
      if ($this.is('.disabled, :disabled')) return
  
      var $parent  = getParent($this)
      var isActive = $parent.hasClass('open')
  
      clearMenus()
  
      if (!isActive) {
        if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
          // if mobile we use a backdrop because click events don't delegate
          $(document.createElement('div'))
            .addClass('dropdown-backdrop')
            .insertAfter($(this))
            .on('click', clearMenus)
        }
  
        var relatedTarget = { relatedTarget: this }
        $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))
  
        if (e.isDefaultPrevented()) return
  
        $this
          .trigger('focus')
          .attr('aria-expanded', 'true')
  
        $parent
          .toggleClass('open')
          .trigger($.Event('shown.bs.dropdown', relatedTarget))
      }
  
      return false
    }
  
    Dropdown.prototype.keydown = function (e) {
      if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return
  
      var $this = $(this)
  
      e.preventDefault()
      e.stopPropagation()
  
      if ($this.is('.disabled, :disabled')) return
  
      var $parent  = getParent($this)
      var isActive = $parent.hasClass('open')
  
      if (!isActive && e.which != 27 || isActive && e.which == 27) {
        if (e.which == 27) $parent.find(toggle).trigger('focus')
        return $this.trigger('click')
      }
  
      var desc = ' li:not(.disabled):visible a'
      var $items = $parent.find('.dropdown-menu' + desc)
  
      if (!$items.length) return
  
      var index = $items.index(e.target)
  
      if (e.which == 38 && index > 0)                 index--         // up
      if (e.which == 40 && index < $items.length - 1) index++         // down
      if (!~index)                                    index = 0
  
      $items.eq(index).trigger('focus')
    }
  
  
    // DROPDOWN PLUGIN DEFINITION
    // ==========================
  
    function Plugin(option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('bs.dropdown')
  
        if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
        if (typeof option == 'string') data[option].call($this)
      })
    }
  
    var old = $.fn.dropdown
  
    $.fn.dropdown             = Plugin
    $.fn.dropdown.Constructor = Dropdown
  
  
    // DROPDOWN NO CONFLICT
    // ====================
  
    $.fn.dropdown.noConflict = function () {
      $.fn.dropdown = old
      return this
    }
  
  
    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================
  
    $(document)
      .on('click.bs.dropdown.data-api', clearMenus)
      .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
      .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
      .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: modal.js v3.3.6
   * http://getbootstrap.com/javascript/#modals
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // MODAL CLASS DEFINITION
    // ======================
  
    var Modal = function (element, options) {
      this.options             = options
      this.$body               = $(document.body)
      this.$element            = $(element)
      this.$dialog             = this.$element.find('.modal-dialog')
      this.$backdrop           = null
      this.isShown             = null
      this.originalBodyPad     = null
      this.scrollbarWidth      = 0
      this.ignoreBackdropClick = false
  
      if (this.options.remote) {
        this.$element
          .find('.modal-content')
          .load(this.options.remote, $.proxy(function () {
            this.$element.trigger('loaded.bs.modal')
          }, this))
      }
    }
  
    Modal.VERSION  = '3.3.6'
  
    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150
  
    Modal.DEFAULTS = {
      backdrop: true,
      keyboard: true,
      show: true
    }
  
    Modal.prototype.toggle = function (_relatedTarget) {
      return this.isShown ? this.hide() : this.show(_relatedTarget)
    }
  
    Modal.prototype.show = function (_relatedTarget) {
      var that = this
      var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })
  
      this.$element.trigger(e)
  
      if (this.isShown || e.isDefaultPrevented()) return
  
      this.isShown = true
  
      this.checkScrollbar()
      this.setScrollbar()
      this.$body.addClass('modal-open')
  
      this.escape()
      this.resize()
  
      this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
  
      this.$dialog.on('mousedown.dismiss.bs.modal', function () {
        that.$element.one('mouseup.dismiss.bs.modal', function (e) {
          if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
        })
      })
  
      this.backdrop(function () {
        var transition = $.support.transition && that.$element.hasClass('fade')
  
        if (!that.$element.parent().length) {
          that.$element.appendTo(that.$body) // don't move modals dom position
        }
  
        that.$element
          .show()
          .scrollTop(0)
  
        that.adjustDialog()
  
        if (transition) {
          that.$element[0].offsetWidth // force reflow
        }
  
        that.$element.addClass('in')
  
        that.enforceFocus()
  
        var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })
  
        transition ?
          that.$dialog // wait for modal to slide in
            .one('bsTransitionEnd', function () {
              that.$element.trigger('focus').trigger(e)
            })
            .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
          that.$element.trigger('focus').trigger(e)
      })
    }
  
    Modal.prototype.hide = function (e) {
      if (e) e.preventDefault()
  
      e = $.Event('hide.bs.modal')
  
      this.$element.trigger(e)
  
      if (!this.isShown || e.isDefaultPrevented()) return
  
      this.isShown = false
  
      this.escape()
      this.resize()
  
      $(document).off('focusin.bs.modal')
  
      this.$element
        .removeClass('in')
        .off('click.dismiss.bs.modal')
        .off('mouseup.dismiss.bs.modal')
  
      this.$dialog.off('mousedown.dismiss.bs.modal')
  
      $.support.transition && this.$element.hasClass('fade') ?
        this.$element
          .one('bsTransitionEnd', $.proxy(this.hideModal, this))
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        this.hideModal()
    }
  
    Modal.prototype.enforceFocus = function () {
      $(document)
        .off('focusin.bs.modal') // guard against infinite focus loop
        .on('focusin.bs.modal', $.proxy(function (e) {
          if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
            this.$element.trigger('focus')
          }
        }, this))
    }
  
    Modal.prototype.escape = function () {
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
          e.which == 27 && this.hide()
        }, this))
      } else if (!this.isShown) {
        this.$element.off('keydown.dismiss.bs.modal')
      }
    }
  
    Modal.prototype.resize = function () {
      if (this.isShown) {
        $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
      } else {
        $(window).off('resize.bs.modal')
      }
    }
  
    Modal.prototype.hideModal = function () {
      var that = this
      this.$element.hide()
      this.backdrop(function () {
        that.$body.removeClass('modal-open')
        that.resetAdjustments()
        that.resetScrollbar()
        that.$element.trigger('hidden.bs.modal')
      })
    }
  
    Modal.prototype.removeBackdrop = function () {
      this.$backdrop && this.$backdrop.remove()
      this.$backdrop = null
    }
  
    Modal.prototype.backdrop = function (callback) {
      var that = this
      var animate = this.$element.hasClass('fade') ? 'fade' : ''
  
      if (this.isShown && this.options.backdrop) {
        var doAnimate = $.support.transition && animate
  
        this.$backdrop = $(document.createElement('div'))
          .addClass('modal-backdrop ' + animate)
          .appendTo(this.$body)
  
        this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (this.ignoreBackdropClick) {
            this.ignoreBackdropClick = false
            return
          }
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus()
            : this.hide()
        }, this))
  
        if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
  
        this.$backdrop.addClass('in')
  
        if (!callback) return
  
        doAnimate ?
          this.$backdrop
            .one('bsTransitionEnd', callback)
            .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
          callback()
  
      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in')
  
        var callbackRemove = function () {
          that.removeBackdrop()
          callback && callback()
        }
        $.support.transition && this.$element.hasClass('fade') ?
          this.$backdrop
            .one('bsTransitionEnd', callbackRemove)
            .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
          callbackRemove()
  
      } else if (callback) {
        callback()
      }
    }
  
    // these following methods are used to handle overflowing modals
  
    Modal.prototype.handleUpdate = function () {
      this.adjustDialog()
    }
  
    Modal.prototype.adjustDialog = function () {
      var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight
  
      this.$element.css({
        paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
        paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
      })
    }
  
    Modal.prototype.resetAdjustments = function () {
      this.$element.css({
        paddingLeft: '',
        paddingRight: ''
      })
    }
  
    Modal.prototype.checkScrollbar = function () {
      var fullWindowWidth = window.innerWidth
      if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
        var documentElementRect = document.documentElement.getBoundingClientRect()
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
      }
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
      this.scrollbarWidth = this.measureScrollbar()
    }
  
    Modal.prototype.setScrollbar = function () {
      var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
      this.originalBodyPad = document.body.style.paddingRight || ''
      if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }
  
    Modal.prototype.resetScrollbar = function () {
      this.$body.css('padding-right', this.originalBodyPad)
    }
  
    Modal.prototype.measureScrollbar = function () { // thx walsh
      var scrollDiv = document.createElement('div')
      scrollDiv.className = 'modal-scrollbar-measure'
      this.$body.append(scrollDiv)
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      this.$body[0].removeChild(scrollDiv)
      return scrollbarWidth
    }
  
  
    // MODAL PLUGIN DEFINITION
    // =======================
  
    function Plugin(option, _relatedTarget) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.modal')
        var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
  
        if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
        if (typeof option == 'string') data[option](_relatedTarget)
        else if (options.show) data.show(_relatedTarget)
      })
    }
  
    var old = $.fn.modal
  
    $.fn.modal             = Plugin
    $.fn.modal.Constructor = Modal
  
  
    // MODAL NO CONFLICT
    // =================
  
    $.fn.modal.noConflict = function () {
      $.fn.modal = old
      return this
    }
  
  
    // MODAL DATA-API
    // ==============
  
    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this   = $(this)
      var href    = $this.attr('href')
      var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
      var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
  
      if ($this.is('a')) e.preventDefault()
  
      $target.one('show.bs.modal', function (showEvent) {
        if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
        $target.one('hidden.bs.modal', function () {
          $this.is(':visible') && $this.trigger('focus')
        })
      })
      Plugin.call($target, option, this)
    })
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: tooltip.js v3.3.6
   * http://getbootstrap.com/javascript/#tooltip
   * Inspired by the original jQuery.tipsy by Jason Frame
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================
  
    var Tooltip = function (element, options) {
      this.type       = null
      this.options    = null
      this.enabled    = null
      this.timeout    = null
      this.hoverState = null
      this.$element   = null
      this.inState    = null
  
      this.init('tooltip', element, options)
    }
  
    Tooltip.VERSION  = '3.3.6'
  
    Tooltip.TRANSITION_DURATION = 150
  
    Tooltip.DEFAULTS = {
      animation: true,
      placement: 'top',
      selector: false,
      template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      container: false,
      viewport: {
        selector: 'body',
        padding: 0
      }
    }
  
    Tooltip.prototype.init = function (type, element, options) {
      this.enabled   = true
      this.type      = type
      this.$element  = $(element)
      this.options   = this.getOptions(options)
      this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
      this.inState   = { click: false, hover: false, focus: false }
  
      if (this.$element[0] instanceof document.constructor && !this.options.selector) {
        throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
      }
  
      var triggers = this.options.trigger.split(' ')
  
      for (var i = triggers.length; i--;) {
        var trigger = triggers[i]
  
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
          var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'
  
          this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }
  
      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }
  
    Tooltip.prototype.getDefaults = function () {
      return Tooltip.DEFAULTS
    }
  
    Tooltip.prototype.getOptions = function (options) {
      options = $.extend({}, this.getDefaults(), this.$element.data(), options)
  
      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay,
          hide: options.delay
        }
      }
  
      return options
    }
  
    Tooltip.prototype.getDelegateOptions = function () {
      var options  = {}
      var defaults = this.getDefaults()
  
      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      })
  
      return options
    }
  
    Tooltip.prototype.enter = function (obj) {
      var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget).data('bs.' + this.type)
  
      if (!self) {
        self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
        $(obj.currentTarget).data('bs.' + this.type, self)
      }
  
      if (obj instanceof $.Event) {
        self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
      }
  
      if (self.tip().hasClass('in') || self.hoverState == 'in') {
        self.hoverState = 'in'
        return
      }
  
      clearTimeout(self.timeout)
  
      self.hoverState = 'in'
  
      if (!self.options.delay || !self.options.delay.show) return self.show()
  
      self.timeout = setTimeout(function () {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }
  
    Tooltip.prototype.isInStateTrue = function () {
      for (var key in this.inState) {
        if (this.inState[key]) return true
      }
  
      return false
    }
  
    Tooltip.prototype.leave = function (obj) {
      var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget).data('bs.' + this.type)
  
      if (!self) {
        self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
        $(obj.currentTarget).data('bs.' + this.type, self)
      }
  
      if (obj instanceof $.Event) {
        self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
      }
  
      if (self.isInStateTrue()) return
  
      clearTimeout(self.timeout)
  
      self.hoverState = 'out'
  
      if (!self.options.delay || !self.options.delay.hide) return self.hide()
  
      self.timeout = setTimeout(function () {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }
  
    Tooltip.prototype.show = function () {
      var e = $.Event('show.bs.' + this.type)
  
      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
  
        var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
        if (e.isDefaultPrevented() || !inDom) return
        var that = this
  
        var $tip = this.tip()
  
        var tipId = this.getUID(this.type)
  
        this.setContent()
        $tip.attr('id', tipId)
        this.$element.attr('aria-describedby', tipId)
  
        if (this.options.animation) $tip.addClass('fade')
  
        var placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement
  
        var autoToken = /\s?auto?\s?/i
        var autoPlace = autoToken.test(placement)
        if (autoPlace) placement = placement.replace(autoToken, '') || 'top'
  
        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })
          .addClass(placement)
          .data('bs.' + this.type, this)
  
        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
        this.$element.trigger('inserted.bs.' + this.type)
  
        var pos          = this.getPosition()
        var actualWidth  = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight
  
        if (autoPlace) {
          var orgPlacement = placement
          var viewportDim = this.getPosition(this.$viewport)
  
          placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                      placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                      placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                      placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                      placement
  
          $tip
            .removeClass(orgPlacement)
            .addClass(placement)
        }
  
        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)
  
        this.applyPlacement(calculatedOffset, placement)
  
        var complete = function () {
          var prevHoverState = that.hoverState
          that.$element.trigger('shown.bs.' + that.type)
          that.hoverState = null
  
          if (prevHoverState == 'out') that.leave(that)
        }
  
        $.support.transition && this.$tip.hasClass('fade') ?
          $tip
            .one('bsTransitionEnd', complete)
            .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
          complete()
      }
    }
  
    Tooltip.prototype.applyPlacement = function (offset, placement) {
      var $tip   = this.tip()
      var width  = $tip[0].offsetWidth
      var height = $tip[0].offsetHeight
  
      // manually read margins because getBoundingClientRect includes difference
      var marginTop = parseInt($tip.css('margin-top'), 10)
      var marginLeft = parseInt($tip.css('margin-left'), 10)
  
      // we must check for NaN for ie 8/9
      if (isNaN(marginTop))  marginTop  = 0
      if (isNaN(marginLeft)) marginLeft = 0
  
      offset.top  += marginTop
      offset.left += marginLeft
  
      // $.fn.offset doesn't round pixel values
      // so we use setOffset directly with our own function B-0
      $.offset.setOffset($tip[0], $.extend({
        using: function (props) {
          $tip.css({
            top: Math.round(props.top),
            left: Math.round(props.left)
          })
        }
      }, offset), 0)
  
      $tip.addClass('in')
  
      // check to see if placing tip in new offset caused the tip to resize itself
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight
  
      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
      }
  
      var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)
  
      if (delta.left) offset.left += delta.left
      else offset.top += delta.top
  
      var isVertical          = /top|bottom/.test(placement)
      var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
      var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'
  
      $tip.offset(offset)
      this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }
  
    Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
      this.arrow()
        .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
        .css(isVertical ? 'top' : 'left', '')
    }
  
    Tooltip.prototype.setContent = function () {
      var $tip  = this.tip()
      var title = this.getTitle()
  
      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }
  
    Tooltip.prototype.hide = function (callback) {
      var that = this
      var $tip = $(this.$tip)
      var e    = $.Event('hide.bs.' + this.type)
  
      function complete() {
        if (that.hoverState != 'in') $tip.detach()
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
        callback && callback()
      }
  
      this.$element.trigger(e)
  
      if (e.isDefaultPrevented()) return
  
      $tip.removeClass('in')
  
      $.support.transition && $tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
  
      this.hoverState = null
  
      return this
    }
  
    Tooltip.prototype.fixTitle = function () {
      var $e = this.$element
      if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }
  
    Tooltip.prototype.hasContent = function () {
      return this.getTitle()
    }
  
    Tooltip.prototype.getPosition = function ($element) {
      $element   = $element || this.$element
  
      var el     = $element[0]
      var isBody = el.tagName == 'BODY'
  
      var elRect    = el.getBoundingClientRect()
      if (elRect.width == null) {
        // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
        elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
      }
      var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
      var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
      var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null
  
      return $.extend({}, elRect, scroll, outerDims, elOffset)
    }
  
    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
      return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
             placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
             placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
          /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }
  
    }
  
    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
      var delta = { top: 0, left: 0 }
      if (!this.$viewport) return delta
  
      var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
      var viewportDimensions = this.getPosition(this.$viewport)
  
      if (/right|left/.test(placement)) {
        var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
        var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
        if (topEdgeOffset < viewportDimensions.top) { // top overflow
          delta.top = viewportDimensions.top - topEdgeOffset
        } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
          delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
        }
      } else {
        var leftEdgeOffset  = pos.left - viewportPadding
        var rightEdgeOffset = pos.left + viewportPadding + actualWidth
        if (leftEdgeOffset < viewportDimensions.left) { // left overflow
          delta.left = viewportDimensions.left - leftEdgeOffset
        } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
          delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
        }
      }
  
      return delta
    }
  
    Tooltip.prototype.getTitle = function () {
      var title
      var $e = this.$element
      var o  = this.options
  
      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)
  
      return title
    }
  
    Tooltip.prototype.getUID = function (prefix) {
      do prefix += ~~(Math.random() * 1000000)
      while (document.getElementById(prefix))
      return prefix
    }
  
    Tooltip.prototype.tip = function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
        if (this.$tip.length != 1) {
          throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
        }
      }
      return this.$tip
    }
  
    Tooltip.prototype.arrow = function () {
      return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }
  
    Tooltip.prototype.enable = function () {
      this.enabled = true
    }
  
    Tooltip.prototype.disable = function () {
      this.enabled = false
    }
  
    Tooltip.prototype.toggleEnabled = function () {
      this.enabled = !this.enabled
    }
  
    Tooltip.prototype.toggle = function (e) {
      var self = this
      if (e) {
        self = $(e.currentTarget).data('bs.' + this.type)
        if (!self) {
          self = new this.constructor(e.currentTarget, this.getDelegateOptions())
          $(e.currentTarget).data('bs.' + this.type, self)
        }
      }
  
      if (e) {
        self.inState.click = !self.inState.click
        if (self.isInStateTrue()) self.enter(self)
        else self.leave(self)
      } else {
        self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
      }
    }
  
    Tooltip.prototype.destroy = function () {
      var that = this
      clearTimeout(this.timeout)
      this.hide(function () {
        that.$element.off('.' + that.type).removeData('bs.' + that.type)
        if (that.$tip) {
          that.$tip.detach()
        }
        that.$tip = null
        that.$arrow = null
        that.$viewport = null
      })
    }
  
  
    // TOOLTIP PLUGIN DEFINITION
    // =========================
  
    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.tooltip')
        var options = typeof option == 'object' && option
  
        if (!data && /destroy|hide/.test(option)) return
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }
  
    var old = $.fn.tooltip
  
    $.fn.tooltip             = Plugin
    $.fn.tooltip.Constructor = Tooltip
  
  
    // TOOLTIP NO CONFLICT
    // ===================
  
    $.fn.tooltip.noConflict = function () {
      $.fn.tooltip = old
      return this
    }
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: popover.js v3.3.6
   * http://getbootstrap.com/javascript/#popovers
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================
  
    var Popover = function (element, options) {
      this.init('popover', element, options)
    }
  
    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')
  
    Popover.VERSION  = '3.3.6'
  
    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
      placement: 'right',
      trigger: 'click',
      content: '',
      template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })
  
  
    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================
  
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)
  
    Popover.prototype.constructor = Popover
  
    Popover.prototype.getDefaults = function () {
      return Popover.DEFAULTS
    }
  
    Popover.prototype.setContent = function () {
      var $tip    = this.tip()
      var title   = this.getTitle()
      var content = this.getContent()
  
      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
        this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
      ](content)
  
      $tip.removeClass('fade top bottom left right in')
  
      // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
      // this manually by checking the contents.
      if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }
  
    Popover.prototype.hasContent = function () {
      return this.getTitle() || this.getContent()
    }
  
    Popover.prototype.getContent = function () {
      var $e = this.$element
      var o  = this.options
  
      return $e.attr('data-content')
        || (typeof o.content == 'function' ?
              o.content.call($e[0]) :
              o.content)
    }
  
    Popover.prototype.arrow = function () {
      return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }
  
  
    // POPOVER PLUGIN DEFINITION
    // =========================
  
    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.popover')
        var options = typeof option == 'object' && option
  
        if (!data && /destroy|hide/.test(option)) return
        if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }
  
    var old = $.fn.popover
  
    $.fn.popover             = Plugin
    $.fn.popover.Constructor = Popover
  
  
    // POPOVER NO CONFLICT
    // ===================
  
    $.fn.popover.noConflict = function () {
      $.fn.popover = old
      return this
    }
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: scrollspy.js v3.3.6
   * http://getbootstrap.com/javascript/#scrollspy
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // SCROLLSPY CLASS DEFINITION
    // ==========================
  
    function ScrollSpy(element, options) {
      this.$body          = $(document.body)
      this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
      this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
      this.selector       = (this.options.target || '') + ' .nav li > a'
      this.offsets        = []
      this.targets        = []
      this.activeTarget   = null
      this.scrollHeight   = 0
  
      this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
      this.refresh()
      this.process()
    }
  
    ScrollSpy.VERSION  = '3.3.6'
  
    ScrollSpy.DEFAULTS = {
      offset: 10
    }
  
    ScrollSpy.prototype.getScrollHeight = function () {
      return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }
  
    ScrollSpy.prototype.refresh = function () {
      var that          = this
      var offsetMethod  = 'offset'
      var offsetBase    = 0
  
      this.offsets      = []
      this.targets      = []
      this.scrollHeight = this.getScrollHeight()
  
      if (!$.isWindow(this.$scrollElement[0])) {
        offsetMethod = 'position'
        offsetBase   = this.$scrollElement.scrollTop()
      }
  
      this.$body
        .find(this.selector)
        .map(function () {
          var $el   = $(this)
          var href  = $el.data('target') || $el.attr('href')
          var $href = /^#./.test(href) && $(href)
  
          return ($href
            && $href.length
            && $href.is(':visible')
            && [[$href[offsetMethod]().top + offsetBase, href]]) || null
        })
        .sort(function (a, b) { return a[0] - b[0] })
        .each(function () {
          that.offsets.push(this[0])
          that.targets.push(this[1])
        })
    }
  
    ScrollSpy.prototype.process = function () {
      var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
      var scrollHeight = this.getScrollHeight()
      var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
      var offsets      = this.offsets
      var targets      = this.targets
      var activeTarget = this.activeTarget
      var i
  
      if (this.scrollHeight != scrollHeight) {
        this.refresh()
      }
  
      if (scrollTop >= maxScroll) {
        return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
      }
  
      if (activeTarget && scrollTop < offsets[0]) {
        this.activeTarget = null
        return this.clear()
      }
  
      for (i = offsets.length; i--;) {
        activeTarget != targets[i]
          && scrollTop >= offsets[i]
          && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
          && this.activate(targets[i])
      }
    }
  
    ScrollSpy.prototype.activate = function (target) {
      this.activeTarget = target
  
      this.clear()
  
      var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'
  
      var active = $(selector)
        .parents('li')
        .addClass('active')
  
      if (active.parent('.dropdown-menu').length) {
        active = active
          .closest('li.dropdown')
          .addClass('active')
      }
  
      active.trigger('activate.bs.scrollspy')
    }
  
    ScrollSpy.prototype.clear = function () {
      $(this.selector)
        .parentsUntil(this.options.target, '.active')
        .removeClass('active')
    }
  
  
    // SCROLLSPY PLUGIN DEFINITION
    // ===========================
  
    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.scrollspy')
        var options = typeof option == 'object' && option
  
        if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }
  
    var old = $.fn.scrollspy
  
    $.fn.scrollspy             = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy
  
  
    // SCROLLSPY NO CONFLICT
    // =====================
  
    $.fn.scrollspy.noConflict = function () {
      $.fn.scrollspy = old
      return this
    }
  
  
    // SCROLLSPY DATA-API
    // ==================
  
    $(window).on('load.bs.scrollspy.data-api', function () {
      $('[data-spy="scroll"]').each(function () {
        var $spy = $(this)
        Plugin.call($spy, $spy.data())
      })
    })
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: tab.js v3.3.6
   * http://getbootstrap.com/javascript/#tabs
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // TAB CLASS DEFINITION
    // ====================
  
    var Tab = function (element) {
      // jscs:disable requireDollarBeforejQueryAssignment
      this.element = $(element)
      // jscs:enable requireDollarBeforejQueryAssignment
    }
  
    Tab.VERSION = '3.3.6'
  
    Tab.TRANSITION_DURATION = 150
  
    Tab.prototype.show = function () {
      var $this    = this.element
      var $ul      = $this.closest('ul:not(.dropdown-menu)')
      var selector = $this.data('target')
  
      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }
  
      if ($this.parent('li').hasClass('active')) return
  
      var $previous = $ul.find('.active:last a')
      var hideEvent = $.Event('hide.bs.tab', {
        relatedTarget: $this[0]
      })
      var showEvent = $.Event('show.bs.tab', {
        relatedTarget: $previous[0]
      })
  
      $previous.trigger(hideEvent)
      $this.trigger(showEvent)
  
      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return
  
      var $target = $(selector)
  
      this.activate($this.closest('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $previous.trigger({
          type: 'hidden.bs.tab',
          relatedTarget: $this[0]
        })
        $this.trigger({
          type: 'shown.bs.tab',
          relatedTarget: $previous[0]
        })
      })
    }
  
    Tab.prototype.activate = function (element, container, callback) {
      var $active    = container.find('> .active')
      var transition = callback
        && $.support.transition
        && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)
  
      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
            .removeClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', false)
  
        element
          .addClass('active')
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
  
        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }
  
        if (element.parent('.dropdown-menu').length) {
          element
            .closest('li.dropdown')
              .addClass('active')
            .end()
            .find('[data-toggle="tab"]')
              .attr('aria-expanded', true)
        }
  
        callback && callback()
      }
  
      $active.length && transition ?
        $active
          .one('bsTransitionEnd', next)
          .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
        next()
  
      $active.removeClass('in')
    }
  
  
    // TAB PLUGIN DEFINITION
    // =====================
  
    function Plugin(option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('bs.tab')
  
        if (!data) $this.data('bs.tab', (data = new Tab(this)))
        if (typeof option == 'string') data[option]()
      })
    }
  
    var old = $.fn.tab
  
    $.fn.tab             = Plugin
    $.fn.tab.Constructor = Tab
  
  
    // TAB NO CONFLICT
    // ===============
  
    $.fn.tab.noConflict = function () {
      $.fn.tab = old
      return this
    }
  
  
    // TAB DATA-API
    // ============
  
    var clickHandler = function (e) {
      e.preventDefault()
      Plugin.call($(this), 'show')
    }
  
    $(document)
      .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
      .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)
  
  }(jQuery);
  
  /* ========================================================================
   * Bootstrap: affix.js v3.3.6
   * http://getbootstrap.com/javascript/#affix
   * ========================================================================
   * Copyright 2011-2015 Twitter, Inc.
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * ======================================================================== */
  
  
  +function ($) {
    'use strict';
  
    // AFFIX CLASS DEFINITION
    // ======================
  
    var Affix = function (element, options) {
      this.options = $.extend({}, Affix.DEFAULTS, options)
  
      this.$target = $(this.options.target)
        .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
        .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))
  
      this.$element     = $(element)
      this.affixed      = null
      this.unpin        = null
      this.pinnedOffset = null
  
      this.checkPosition()
    }
  
    Affix.VERSION  = '3.3.6'
  
    Affix.RESET    = 'affix affix-top affix-bottom'
  
    Affix.DEFAULTS = {
      offset: 0,
      target: window
    }
  
    Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
      var scrollTop    = this.$target.scrollTop()
      var position     = this.$element.offset()
      var targetHeight = this.$target.height()
  
      if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false
  
      if (this.affixed == 'bottom') {
        if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
        return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
      }
  
      var initializing   = this.affixed == null
      var colliderTop    = initializing ? scrollTop : position.top
      var colliderHeight = initializing ? targetHeight : height
  
      if (offsetTop != null && scrollTop <= offsetTop) return 'top'
      if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'
  
      return false
    }
  
    Affix.prototype.getPinnedOffset = function () {
      if (this.pinnedOffset) return this.pinnedOffset
      this.$element.removeClass(Affix.RESET).addClass('affix')
      var scrollTop = this.$target.scrollTop()
      var position  = this.$element.offset()
      return (this.pinnedOffset = position.top - scrollTop)
    }
  
    Affix.prototype.checkPositionWithEventLoop = function () {
      setTimeout($.proxy(this.checkPosition, this), 1)
    }
  
    Affix.prototype.checkPosition = function () {
      if (!this.$element.is(':visible')) return
  
      var height       = this.$element.height()
      var offset       = this.options.offset
      var offsetTop    = offset.top
      var offsetBottom = offset.bottom
      var scrollHeight = Math.max($(document).height(), $(document.body).height())
  
      if (typeof offset != 'object')         offsetBottom = offsetTop = offset
      if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
      if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)
  
      var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)
  
      if (this.affixed != affix) {
        if (this.unpin != null) this.$element.css('top', '')
  
        var affixType = 'affix' + (affix ? '-' + affix : '')
        var e         = $.Event(affixType + '.bs.affix')
  
        this.$element.trigger(e)
  
        if (e.isDefaultPrevented()) return
  
        this.affixed = affix
        this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null
  
        this.$element
          .removeClass(Affix.RESET)
          .addClass(affixType)
          .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
      }
  
      if (affix == 'bottom') {
        this.$element.offset({
          top: scrollHeight - height - offsetBottom
        })
      }
    }
  
  
    // AFFIX PLUGIN DEFINITION
    // =======================
  
    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.affix')
        var options = typeof option == 'object' && option
  
        if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }
  
    var old = $.fn.affix
  
    $.fn.affix             = Plugin
    $.fn.affix.Constructor = Affix
  
  
    // AFFIX NO CONFLICT
    // =================
  
    $.fn.affix.noConflict = function () {
      $.fn.affix = old
      return this
    }
  
  
    // AFFIX DATA-API
    // ==============
  
    $(window).on('load', function () {
      $('[data-spy="affix"]').each(function () {
        var $spy = $(this)
        var data = $spy.data()
  
        data.offset = data.offset || {}
  
        if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
        if (data.offsetTop    != null) data.offset.top    = data.offsetTop
  
        Plugin.call($spy, data)
      })
    })
  
  }(jQuery);
  $(document).ready(function() {
    $("[data-orgin-color]").click(function (){
        $this=$(this);
       $color=$(this).data("orgin-color");
       $add_color=$(this).data("click-color");
       if ($add_color!= undefined && $add_color!="" && $color!= undefined && $color!=""){
           $(this).css("background",$add_color);
           setTimeout(function (){
               $this.css("background",$color);
           },100);
       }
    });
    $height=$(window).height();
    $nav_height=$(".navbar-default").height();
    $total_values=$("#total_values").height();
    $submit_cart=$("#submit_cart").height();
    $div_note=0;
    if ($("#divnote").length>0){
        $div_note=$("#divnote").height()+20;
    }
    $scrol_height=$height-($nav_height+48 + $submit_cart+22+30+$div_note);
    $(".item-cart").slimScroll({
    height: $scrol_height + 'px'
});
     
    $current_index = 1;
    $(".add-to-cart").click(function() {


        $uid = $(this).data("id");
        if ($uid !== undefined && $uid != "") {
            $.ajax({url: "ajax_get_pro_to_cart.php", data: {uid: $uid}, type: "post", dataType: "json",
                success: function(data) {
                    if (data.status === "success") {

                        $("#add_to_cart_modal .modal-body").html(data.html);
                        $("#add_to_cart_modal").modal();
                        $current_index = $(".hidden.array_units").attr("data-default-index");

                        if ($current_index === undefined || $current_index === "") {
                            $current_index = 1;
                        } else {
                            $current_index = parseInt($current_index);
                        }

                        $(".current-unit-txt").val($(".array_units li[data-index='" + $current_index + "']").text());
                        $("#price_pro_modal").text($(".array_units li[data-index='" + $current_index + "']").attr("data-price"));

                    }
                }});

        }
    });

    $("body").on("click", ".minus-qty", function() {
        $qty = $(".qty-pro").val();
        if ($qty !== "" && $qty !== undefined) {
            $qty = parseInt($qty);
        } else {
            $qty = 1;
        }
        $new_qty = $qty - 1;
        if ($new_qty < 1) {
            $new_qty = 1;
        }
        $(".qty-pro").val($new_qty);
    });
    $("body").on("click", ".plus-qty", function() {


        $qty = $(".qty-pro").val();
        if ($qty !== "" && $qty !== undefined) {
            $qty = parseInt($qty);
        } else {
            $qty = 1;
        }

        $new_qty = $qty + 1;

        $(".qty-pro").val($new_qty);
    });
    $(".evnt-add-to-cart-single").click(function() {
        $uid = $(this).data("id");
        $default_unit = $(this).data("default-unit");
        if ($default_unit === undefined || $default_unit === "") {
            $default_unit = 0;
        }
        $default_unit = parseInt($default_unit);
        if ($default_unit > 0) {
            $default_unit++;
        }
        if ($uid !== undefined && $uid !== "") {
            $.ajax({url: "ajax_add_to_cart.php", data: {uid: $uid, single: "true", unit: $default_unit}, type: "post", dataType: "json",
                success: function(data) {
                    if (data.status === "success") {

                        $("#add_to_cart_modal .modal-body").html("");
                        $("#add_to_cart_modal").modal("hide");
                        $(".notification").text(data.total_cart);
                        $("#ext-script").remove();
                        $("body").append(data.script);
                    }
                }});

        }

    })
    $("body").on("click", ".evnt-add-to-cart", function() {
        $uid = $(this).data("id");
        $qty = $(".qty-pro").val();
        $notes = $(".notes_pro").val();
        if ($qty !== "" && $qty !== undefined) {
            $qty = parseInt($qty);
        } else {
            $qty = 1;
        }
        if ($notes === undefined) {
            $notes = "";
        }
        $unit = $(".hidden.array_units li[data-index='" + $current_index + "']").data("unit");
        if ($unit === undefined || $unit === "") {
            $unit = 0;
        }
        $unit = parseInt($unit);
        if ($unit > 0) {
            $unit++;
        }

        if ($uid !== undefined && $uid !== "") {
            $.ajax({url: "ajax_add_to_cart.php", data: {uid: $uid, qty: $qty, notes: $notes, unit: $unit}, type: "post", dataType: "json",
                success: function(data) {
                    if (data.status === "success") {

                        $("#add_to_cart_modal .modal-body").html("");
                        $("#add_to_cart_modal").modal("hide");
                        $(".notification").text(data.total_cart);
                        $("#ext-script").remove();
                        $("body").append(data.script);
                    }
                }});

        }
    });
    $("body").on("click", ".remove_from_cart", function() {
        $uid = $(this).data("id");
        
        $price = $(this).data("price");

        if ($price !== undefined && $price != "") {
            $price = parseFloat($price);
        }
        else {
            $price = 0;
        }
        $total_price = $("#total_price").text();
        if ($total_price !== undefined && $total_price != "") {
            $total_price = parseFloat($total_price);
        }
        else {
            $total_price = 0;
        }
        $new_total_price = $total_price - $price;

        if ($uid !== undefined && $uid != "") {
            $.ajax({url: "remove_from_cart.php", data: {uid: $uid},async:false, type: "post", dataType: "json",
                success: function(data) {
                    
                    if (data.status === "success") {
                        
                        $(".cart-i[data-id='" + $uid + "']").fadeOut();
                        $("#total_price").text($new_total_price);
                        $("#total_qty").text(data.new_qty);
                        $("#ext-script").remove();
                        $("body").append(data.script);
                    }
                }});

        }

    });
    $(window).resize(function() {

        resize_aj();

    })

    resize_aj();

    function resize_aj() {

    }

    $("body").on("click", ".change-unit", function() {
        $opt = $(this).attr("data-opt");
        $units_length = $(".array_units li").length;
        if ($opt !== undefined && $opt !== "" && $units_length > 1) {

            if ($opt === "next") {
                if ($current_index + 1 > $units_length) {
                    $current_index = 1;
                } else {
                    $current_index++;
                }
            } else {
                if ($current_index - 1 < 1) {
                    $current_index = $units_length;
                } else {
                    $current_index--;
                }
            }

            $(".current-unit-txt").val($(".array_units li[data-index='" + $current_index + "']").text());
            $("#price_pro_modal").text($(".array_units li[data-index='" + $current_index + "']").attr("data-price"));
        }
    });


    $("body").on("click", ".minus-cart", function() {

        $id = $(this).data("id");
        $unit = $(this).data("unit");
        if ($id !== undefined && $id !== '' && $unit !== undefined && $unit !== '') {
            $qty = $(".qty-pro[data-id='" + $id + "'][data-unit='" + $unit + "']").val();
            if ($qty !== "" && $qty !== undefined) {
                $qty = parseInt($qty);
            } else {
                $qty = 1;
            }
            $new_qty = $qty - 1;
            if ($new_qty < 1) {
                $new_qty = 1;
            }
            $(".qty-pro[data-id='" + $id + "'][data-unit='" + $unit + "']").val($new_qty).trigger("change");
        }
    });
    $("body").on("click", ".plus-cart", function() {

        $id = $(this).data("id");
        $unit = $(this).data("unit");
        if ($id !== undefined && $id !== '' && $unit !== undefined && $unit !== '') {
            $qty = $(".qty-pro[data-id='" + $id + "'][data-unit='" + $unit + "']").val();
            if ($qty !== "" && $qty !== undefined) {
                $qty = parseInt($qty);
            } else {
                $qty = 1;
            }

            $new_qty = $qty + 1;

            $(".qty-pro[data-id='" + $id + "'][data-unit='" + $unit + "']").val($new_qty).trigger("change");

        }
    });


    $(".qty-pro[data-id][data-unit]").change(function() {
        $id = $(this).data("id");
        $unit = $(this).data("unit");
        $price = $(this).data("price");
        $old_qty = $(this).data("old-qty");
        $qty = $(this).val();
        if ($id !== undefined && $id !== '' && $unit !== undefined && $unit !== '' && $qty !== '') {
            $.ajax({url: "change_qty_cart.php", type: "post", dataType: "json", data: {
                    id: $id, unit: $unit, qty: $qty, price: $price, old_qty: $old_qty
                }, success: function(data) {
                    if (data.success === true) {
                        $cuurent_total_price = parseFloat($("#total_price").text());
                        $current_total_qty = parseInt($("#total_qty").text());
                        $current_total_price_pro = parseFloat($(".t-price[data-id='" + $id + "'][data-unit='" + $unit + "']").text());

                        $new_total_price = parseFloat(data.total_price);
                        $new_total_qty = parseInt(data.total_qty);
                        $new_price = parseFloat(data.new_price);

                        $("#total_price").text($cuurent_total_price + $new_total_price);
                        $("#total_qty").text($current_total_qty + $new_total_qty);
                        $(".t-price[data-id='" + $id + "'][data-unit='" + $unit + "']").text($new_price);
                        $(".qty-pro[data-id='" + $id + "'][data-unit='" + $unit + "']").data("old-qty", $qty);
                        $("body").append(data.script);

                    }
                }})

        }

    });
});/*! jQuery v1.12.3 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="1.12.3",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(n.isPlainObject(c)||(b=n.isArray(c)))?(b?(b=!1,f=a&&n.isArray(a)?a:[]):f=a&&n.isPlainObject(a)?a:{},g[d]=n.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray||function(a){return"array"===n.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){var b=a&&a.toString();return!n.isArray(a)&&b-parseFloat(b)+1>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;try{if(a.constructor&&!k.call(a,"constructor")&&!k.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(!l.ownFirst)for(b in a)return k.call(a,b);for(b in a);return void 0===b||k.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(b){b&&n.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(h)return h.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(f=a[b],b=a,a=f),n.isFunction(a)?(c=e.call(arguments,2),d=function(){return a.apply(b||this,c.concat(e.call(arguments)))},d.guid=a.guid=a.guid||n.guid++,d):void 0},now:function(){return+new Date},support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s,w=b&&b.ownerDocument,x=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==x&&9!==x&&11!==x)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==x&&(o=$.exec(a)))if(f=o[1]){if(9===x){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(w&&(j=w.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(o[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=o[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==x)w=b,s=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),r=g(a),h=r.length,l=V.test(k)?"#"+k:"[id='"+k+"']";while(h--)r[h]=l+" "+qa(r[h]);s=r.join(","),w=_.test(a)&&oa(b.parentNode)||b}if(s)try{return H.apply(d,w.querySelectorAll(s)),d}catch(y){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=R.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},v=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},w=n.expr.match.needsContext,x=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,y=/^.[^:#\[\.,]*$/;function z(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(y.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return n.inArray(a,b)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;e>b;b++)if(n.contains(d[b],this))return!0}));for(b=0;e>b;b++)n.find(a,d[b],c);return c=this.pushStack(e>1?n.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(z(this,a||[],!1))},not:function(a){return this.pushStack(z(this,a||[],!0))},is:function(a){return!!z(this,"string"==typeof a&&w.test(a)?n(a):a||[],!1).length}});var A,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||A,"string"==typeof a){if(e="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:B.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),x.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}if(f=d.getElementById(e[2]),f&&f.parentNode){if(f.id!==e[2])return A.find(a);this.length=1,this[0]=f}return this.context=d,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof c.ready?c.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};C.prototype=n.fn,A=n(d);var D=/^(?:parents|prev(?:Until|All))/,E={children:!0,contents:!0,next:!0,prev:!0};n.fn.extend({has:function(a){var b,c=n(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(n.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=w.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?n.inArray(this[0],n(a)):n.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function F(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return u(a,"parentNode")},parentsUntil:function(a,b,c){return u(a,"parentNode",c)},next:function(a){return F(a,"nextSibling")},prev:function(a){return F(a,"previousSibling")},nextAll:function(a){return u(a,"nextSibling")},prevAll:function(a){return u(a,"previousSibling")},nextUntil:function(a,b,c){return u(a,"nextSibling",c)},prevUntil:function(a,b,c){return u(a,"previousSibling",c)},siblings:function(a){return v((a.parentNode||{}).firstChild,a)},children:function(a){return v(a.firstChild)},contents:function(a){return n.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(E[a]||(e=n.uniqueSort(e)),D.test(a)&&(e=e.reverse())),this.pushStack(e)}});var G=/\S+/g;function H(a){var b={};return n.each(a.match(G)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?H(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=!0,c||j.disable(),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(c.notify).done(c.resolve).fail(c.reject):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=e.call(arguments),d=c.length,f=1!==d||a&&n.isFunction(a.promise)?d:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(d>1)for(i=new Array(d),j=new Array(d),k=new Array(d);d>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().progress(h(b,j,i)).done(h(b,k,c)).fail(g.reject):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(d,[n]),n.fn.triggerHandler&&(n(d).triggerHandler("ready"),n(d).off("ready"))))}});function J(){d.addEventListener?(d.removeEventListener("DOMContentLoaded",K),a.removeEventListener("load",K)):(d.detachEvent("onreadystatechange",K),a.detachEvent("onload",K))}function K(){(d.addEventListener||"load"===a.event.type||"complete"===d.readyState)&&(J(),n.ready())}n.ready.promise=function(b){if(!I)if(I=n.Deferred(),"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll)a.setTimeout(n.ready);else if(d.addEventListener)d.addEventListener("DOMContentLoaded",K),a.addEventListener("load",K);else{d.attachEvent("onreadystatechange",K),a.attachEvent("onload",K);var c=!1;try{c=null==a.frameElement&&d.documentElement}catch(e){}c&&c.doScroll&&!function f(){if(!n.isReady){try{c.doScroll("left")}catch(b){return a.setTimeout(f,50)}J(),n.ready()}}()}return I.promise(b)},n.ready.promise();var L;for(L in n(l))break;l.ownFirst="0"===L,l.inlineBlockNeedsLayout=!1,n(function(){var a,b,c,e;c=d.getElementsByTagName("body")[0],c&&c.style&&(b=d.createElement("div"),e=d.createElement("div"),e.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(e).appendChild(b),"undefined"!=typeof b.style.zoom&&(b.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",l.inlineBlockNeedsLayout=a=3===b.offsetWidth,a&&(c.style.zoom=1)),c.removeChild(e))}),function(){var a=d.createElement("div");l.deleteExpando=!0;try{delete a.test}catch(b){l.deleteExpando=!1}a=null}();var M=function(a){var b=n.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b},N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(O,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}n.data(a,b,c)}else c=void 0;
}return c}function Q(a){var b;for(b in a)if(("data"!==b||!n.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function R(a,b,d,e){if(M(a)){var f,g,h=n.expando,i=a.nodeType,j=i?n.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||n.guid++:h),j[k]||(j[k]=i?{}:{toJSON:n.noop}),"object"!=typeof b&&"function"!=typeof b||(e?j[k]=n.extend(j[k],b):j[k].data=n.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[n.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[n.camelCase(b)])):f=g,f}}function S(a,b,c){if(M(a)){var d,e,f=a.nodeType,g=f?n.cache:a,h=f?a[n.expando]:n.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){n.isArray(b)?b=b.concat(n.map(b,n.camelCase)):b in d?b=[b]:(b=n.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!Q(d):!n.isEmptyObject(d))return}(c||(delete g[h].data,Q(g[h])))&&(f?n.cleanData([a],!0):l.deleteExpando||g!=g.window?delete g[h]:g[h]=void 0)}}}n.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?n.cache[a[n.expando]]:a[n.expando],!!a&&!Q(a)},data:function(a,b,c){return R(a,b,c)},removeData:function(a,b){return S(a,b)},_data:function(a,b,c){return R(a,b,c,!0)},_removeData:function(a,b){return S(a,b,!0)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=n.data(f),1===f.nodeType&&!n._data(f,"parsedAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));n._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){n.data(this,a)}):arguments.length>1?this.each(function(){n.data(this,a,b)}):f?P(f,a,n.data(f,a)):void 0},removeData:function(a){return this.each(function(){n.removeData(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=n._data(a,b),c&&(!d||n.isArray(c)?d=n._data(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return n._data(a,c)||n._data(a,c,{empty:n.Callbacks("once memory").add(function(){n._removeData(a,b+"queue"),n._removeData(a,c)})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=n._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}}),function(){var a;l.shrinkWrapBlocks=function(){if(null!=a)return a;a=!1;var b,c,e;return c=d.getElementsByTagName("body")[0],c&&c.style?(b=d.createElement("div"),e=d.createElement("div"),e.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(e).appendChild(b),"undefined"!=typeof b.style.zoom&&(b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",b.appendChild(d.createElement("div")).style.width="5px",a=3!==b.offsetWidth),c.removeChild(e),a):void 0}}();var T=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,U=new RegExp("^(?:([+-])=|)("+T+")([a-z%]*)$","i"),V=["Top","Right","Bottom","Left"],W=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)};function X(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return n.css(a,b,"")},i=h(),j=c&&c[3]||(n.cssNumber[b]?"":"px"),k=(n.cssNumber[b]||"px"!==j&&+i)&&U.exec(n.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,n.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var Y=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)Y(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},Z=/^(?:checkbox|radio)$/i,$=/<([\w:-]+)/,_=/^$|\/(?:java|ecma)script/i,aa=/^\s+/,ba="abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";function ca(a){var b=ba.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}!function(){var a=d.createElement("div"),b=d.createDocumentFragment(),c=d.createElement("input");a.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",l.leadingWhitespace=3===a.firstChild.nodeType,l.tbody=!a.getElementsByTagName("tbody").length,l.htmlSerialize=!!a.getElementsByTagName("link").length,l.html5Clone="<:nav></:nav>"!==d.createElement("nav").cloneNode(!0).outerHTML,c.type="checkbox",c.checked=!0,b.appendChild(c),l.appendChecked=c.checked,a.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!a.cloneNode(!0).lastChild.defaultValue,b.appendChild(a),c=d.createElement("input"),c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),a.appendChild(c),l.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,l.noCloneEvent=!!a.addEventListener,a[n.expando]=1,l.attributes=!a.getAttribute(n.expando)}();var da={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:l.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]};da.optgroup=da.option,da.tbody=da.tfoot=da.colgroup=da.caption=da.thead,da.th=da.td;function ea(a,b){var c,d,e=0,f="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||n.nodeName(d,b)?f.push(d):n.merge(f,ea(d,b));return void 0===b||b&&n.nodeName(a,b)?n.merge([a],f):f}function fa(a,b){for(var c,d=0;null!=(c=a[d]);d++)n._data(c,"globalEval",!b||n._data(b[d],"globalEval"))}var ga=/<|&#?\w+;/,ha=/<tbody/i;function ia(a){Z.test(a.type)&&(a.defaultChecked=a.checked)}function ja(a,b,c,d,e){for(var f,g,h,i,j,k,m,o=a.length,p=ca(b),q=[],r=0;o>r;r++)if(g=a[r],g||0===g)if("object"===n.type(g))n.merge(q,g.nodeType?[g]:g);else if(ga.test(g)){i=i||p.appendChild(b.createElement("div")),j=($.exec(g)||["",""])[1].toLowerCase(),m=da[j]||da._default,i.innerHTML=m[1]+n.htmlPrefilter(g)+m[2],f=m[0];while(f--)i=i.lastChild;if(!l.leadingWhitespace&&aa.test(g)&&q.push(b.createTextNode(aa.exec(g)[0])),!l.tbody){g="table"!==j||ha.test(g)?"<table>"!==m[1]||ha.test(g)?0:i:i.firstChild,f=g&&g.childNodes.length;while(f--)n.nodeName(k=g.childNodes[f],"tbody")&&!k.childNodes.length&&g.removeChild(k)}n.merge(q,i.childNodes),i.textContent="";while(i.firstChild)i.removeChild(i.firstChild);i=p.lastChild}else q.push(b.createTextNode(g));i&&p.removeChild(i),l.appendChecked||n.grep(ea(q,"input"),ia),r=0;while(g=q[r++])if(d&&n.inArray(g,d)>-1)e&&e.push(g);else if(h=n.contains(g.ownerDocument,g),i=ea(p.appendChild(g),"script"),h&&fa(i),c){f=0;while(g=i[f++])_.test(g.type||"")&&c.push(g)}return i=null,p}!function(){var b,c,e=d.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(l[b]=c in a)||(e.setAttribute(c,"t"),l[b]=e.attributes[c].expando===!1);e=null}();var ka=/^(?:input|select|textarea)$/i,la=/^key/,ma=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,na=/^(?:focusinfocus|focusoutblur)$/,oa=/^([^.]*)(?:\.(.+)|)/;function pa(){return!0}function qa(){return!1}function ra(){try{return d.activeElement}catch(a){}}function sa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)sa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=qa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=n.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return"undefined"==typeof n||a&&n.event.triggered===a.type?void 0:n.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(G)||[""],h=b.length;while(h--)f=oa.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=n.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=n.event.special[o]||{},l=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},i),(m=g[o])||(m=g[o]=[],m.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,l):m.push(l),n.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n.hasData(a)&&n._data(a);if(r&&(k=r.events)){b=(b||"").match(G)||[""],j=b.length;while(j--)if(h=oa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=m.length;while(f--)g=m[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(m.splice(f,1),g.selector&&m.delegateCount--,l.remove&&l.remove.call(a,g));i&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(k)&&(delete r.handle,n._removeData(a,"events"))}},trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(i=m=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!na.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),h=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),l=n.event.special[q]||{},f||!l.trigger||l.trigger.apply(e,c)!==!1)){if(!f&&!l.noBubble&&!n.isWindow(e)){for(j=l.delegateType||q,na.test(j+q)||(i=i.parentNode);i;i=i.parentNode)p.push(i),m=i;m===(e.ownerDocument||d)&&p.push(m.defaultView||m.parentWindow||a)}o=0;while((i=p[o++])&&!b.isPropagationStopped())b.type=o>1?j:l.bindType||q,g=(n._data(i,"events")||{})[b.type]&&n._data(i,"handle"),g&&g.apply(i,c),g=h&&i[h],g&&g.apply&&M(i)&&(b.result=g.apply(i,c),b.result===!1&&b.preventDefault());if(b.type=q,!f&&!b.isDefaultPrevented()&&(!l._default||l._default.apply(p.pop(),c)===!1)&&M(e)&&h&&e[q]&&!n.isWindow(e)){m=e[h],m&&(e[h]=null),n.event.triggered=q;try{e[q]()}catch(s){}n.event.triggered=void 0,m&&(e[h]=m)}return b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(n._data(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())a.rnamespace&&!a.rnamespace.test(g.namespace)||(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[n.expando])return a;var b,c,e,f=a.type,g=a,h=this.fixHooks[f];h||(this.fixHooks[f]=h=ma.test(f)?this.mouseHooks:la.test(f)?this.keyHooks:{}),e=h.props?this.props.concat(h.props):this.props,a=new n.Event(g),b=e.length;while(b--)c=e[b],a[c]=g[c];return a.target||(a.target=g.srcElement||d),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,h.filter?h.filter(a,g):a},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button,h=b.fromElement;return null==a.pageX&&null!=b.clientX&&(e=a.target.ownerDocument||d,f=e.documentElement,c=e.body,a.pageX=b.clientX+(f&&f.scrollLeft||c&&c.scrollLeft||0)-(f&&f.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(f&&f.scrollTop||c&&c.scrollTop||0)-(f&&f.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&h&&(a.relatedTarget=h===a.target?b.toElement:h),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==ra()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===ra()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return n.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b),d.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=d.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)}:function(a,b,c){var d="on"+b;a.detachEvent&&("undefined"==typeof a[d]&&(a[d]=null),a.detachEvent(d,c))},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?pa:qa):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:qa,isPropagationStopped:qa,isImmediatePropagationStopped:qa,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=pa,a&&(a.preventDefault
