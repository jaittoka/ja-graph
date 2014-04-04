module.exports = class Graph
  constructor: () ->
    @dependencies = {}

  _getDeps: (a) -> @dependencies[a] ?= { f: {}, b: {} }

  _depsToArray: (deps) ->
    if deps?
      { name: b, kind } for b, kind of deps
    else
      []

  _depChain: (a, link) ->
    seen = {}
    self = @

    traverse = (parent) ->
      return true if seen[parent.name]?
      seen[parent.name] = true
      deps = self[link] parent.name
      for dep in deps
        parent.deps.push n = { name: dep.name, kind: dep.kind, deps: [] } 
        n.cyclic = true if traverse n
      false
    
    root = { name: a, deps: [] }
    traverse root
    root.deps

  # Add a dependency from 'a' to 'b'  
  setForward: (a, b, kind) ->
    ao = @_getDeps a
    bo = @_getDeps b
    ao.f[b] = kind
    bo.b[a] = kind
    ao

  # Add a depencency from 'b' to 'a'
  setBackward: (a, b, kind) ->
    ao = @_getDeps a
    bo = @_getDeps b
    ao.b[b] = kind
    bo.f[a] = kind
    bo
  
  # Remove all forward dependencies from 'a'
  clearForward: (a) -> a.f = {} if (a = @dependencies[a])?

  # Remove all backward dependencies from 'a'
  clearBackward: (a) -> a.b = {} if (a = @dependencies[a])?

  # Return a list of direct successors of 'a'
  getForward: (a) -> @_depsToArray @dependencies[a]?.f

  # Return a list of direct predecessors of 'a'
  getBackward: (a) -> @_depsToArray @dependencies[a]?.b

  # Return a dependency graph forward from 'a'
  getForwardAll: (a) -> @_depChain a, 'getForward'

  # Return a dependency graph backward from 'a'
  getBackwardAll: (a) -> @_depChain a, 'getBackward'

