exports.createFakeContext = function createFakeContext(context) {
  return Object.create({
    filePath: "fakeContext/fakeContext.html",
    dir: "fakeContext",
    Indexes: {
      lastIslandId: 0,
      currentNodeId: 0,
    },
    __islands: {},
    __ce: {},
    __promises: [],
    ...context,
  });
};
