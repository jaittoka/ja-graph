(function() {
  var Graph;

  module.exports = Graph = (function() {
    function Graph() {
      this.dependencies = {};
    }

    Graph.prototype._getDeps = function(a) {
      var _base;
      return (_base = this.dependencies)[a] != null ? _base[a] : _base[a] = {
        f: {},
        b: {}
      };
    };

    Graph.prototype._depsToArray = function(deps) {
      var b, kind, _results;
      if (deps != null) {
        _results = [];
        for (b in deps) {
          kind = deps[b];
          _results.push({
            name: b,
            kind: kind
          });
        }
        return _results;
      } else {
        return [];
      }
    };

    Graph.prototype._depChain = function(a, link) {
      var root, seen, self, traverse;
      seen = {};
      self = this;
      traverse = function(parent) {
        var dep, deps, n, _i, _len;
        if (seen[parent.name] != null) {
          return true;
        }
        seen[parent.name] = true;
        deps = self[link](parent.name);
        for (_i = 0, _len = deps.length; _i < _len; _i++) {
          dep = deps[_i];
          parent.deps.push(n = {
            name: dep.name,
            kind: dep.kind,
            deps: []
          });
          if (traverse(n)) {
            n.cyclic = true;
          }
        }
        return false;
      };
      root = {
        name: a,
        deps: []
      };
      traverse(root);
      return root.deps;
    };

    Graph.prototype.setForward = function(a, b, kind) {
      var ao, bo;
      ao = this._getDeps(a);
      bo = this._getDeps(b);
      ao.f[b] = kind;
      bo.b[a] = kind;
      return ao;
    };

    Graph.prototype.setBackward = function(a, b, kind) {
      var ao, bo;
      ao = this._getDeps(a);
      bo = this._getDeps(b);
      ao.b[b] = kind;
      bo.f[a] = kind;
      return bo;
    };

    Graph.prototype.clearForward = function(a) {
      if ((a = this.dependencies[a]) != null) {
        return a.f = {};
      }
    };

    Graph.prototype.clearBackward = function(a) {
      if ((a = this.dependencies[a]) != null) {
        return a.b = {};
      }
    };

    Graph.prototype.getForward = function(a) {
      var _ref;
      return this._depsToArray((_ref = this.dependencies[a]) != null ? _ref.f : void 0);
    };

    Graph.prototype.getBackward = function(a) {
      var _ref;
      return this._depsToArray((_ref = this.dependencies[a]) != null ? _ref.b : void 0);
    };

    Graph.prototype.getForwardAll = function(a) {
      return this._depChain(a, 'getForward');
    };

    Graph.prototype.getBackwardAll = function(a) {
      return this._depChain(a, 'getBackward');
    };

    return Graph;

  })();

}).call(this);
