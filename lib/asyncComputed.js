var prefix = '_async_computed$';

var installed = false;

var AsyncComputed = {
  install: function install(Vue, options) {
    options = options || {};

    if (installed) return;
    installed = true;

    Vue.config.optionMergeStrategies.asyncComputed = Vue.config.optionMergeStrategies.computed;

    Vue.mixin({
      beforeCreate: function beforeCreate() {
        var _this = this;

        var optionData = this.$options.data;
        var newData = {};

        if (!this.$options.computed) this.$options.computed = {};

        Object.keys(this.$options.asyncComputed || {}).forEach(function (key) {
          var fn = _this.$options.asyncComputed[key];
          var get = typeof fn === 'function' ? fn : fn.get,
            def = typeof fn.default === 'undefined' ? null : fn.default;

          _this.$options.computed[prefix + key] = get;
          newData[key] = def;
        });

        this.$options.data = function vueAsyncComputedInjectedDataFn() {
          var data = (typeof optionData === 'function' ? optionData.call(this) : optionData) || {};
          Object.keys(newData).forEach(function (key) {
            data[key] = newData[key];
          });
          return data;
        };
      },
      created: function created() {
        var _this2 = this;

        Object.keys(this.$options.asyncComputed || {}).forEach(function (key) {
          var promiseId = 0;
          _this2.$watch(prefix + key, function (newPromise) {
            var thisPromise = ++promiseId;
            newPromise.then(function (value) {
              if (thisPromise !== promiseId) return;
              _this2[key] = value;
            }).catch(function (err) {
              if (thisPromise !== promiseId) return;

              if (options.errorHandler === false) return;

              var handler = options.errorHandler === undefined ? console.error.bind(console, 'Error evaluating async computed property:') : options.errorHandler;

              handler(err.stack);
            });
          }, { immediate: true });
        });
      }
    });
  }
};
