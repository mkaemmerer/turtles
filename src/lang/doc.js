const match = (node, handlers) => handlers[node.type](node);

export const Doc = {};
Doc.Empty = { type: 'Doc.Empty' };
Doc.Text  = ({text,  doc}) => ({ type: 'Doc.Text', text,  doc});
Doc.Line  = ({depth, doc}) => ({ type: 'Doc.Line', depth, doc});

export const indent = (doc) => match(doc, {
  'Doc.Empty': () => Doc.Empty,
  'Doc.Text': ({text, doc}) => Doc.Text({
    text,
    doc: indent(doc)
  }),
  'Doc.Line': ({depth, doc}) => Doc.Line({
    depth: depth+1,
    doc: indent(doc)
  })
});
export const concat = (doc1, doc2) => match(doc1, {
  'Doc.Empty': () => doc2,
  'Doc.Text': ({text, doc}) => Doc.Text({
    text,
    doc: concat(doc, doc2)
  }),
  'Doc.Line': ({depth, doc}) => Doc.Line({
    depth,
    doc: concat(doc, doc2)
  })
});

export const str         = (text) => Doc.Text({text, doc: Doc.Empty});
export const seq         = (arr) => arr.reduce(concat, Doc.Empty);
export const newline     = Doc.Line({depth: 0, doc: Doc.Empty});
export const intersperse = (docs, sep) =>
  docs.reduce((acc, doc) =>
    (doc === docs[0])
      ? doc
      : seq([acc, sep, doc])
  , Doc.Empty);
