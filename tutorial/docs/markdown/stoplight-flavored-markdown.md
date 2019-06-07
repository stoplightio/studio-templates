---
tags: [01. Using Markdown]
---

# Stoplight Flavored Markdown (SMD)

### The Two Laws

1.  SMD is human readable. A human with a simple text editor can easily read and comprehend smd.
2.  SMD degrades gracefully. SMD documents rendered on `github.com` should be clean and readable.

### The Approach

1.  Stoplight flavored markdown extends github flavor markdown with inline comment annotations.
2.  The value inside of the annotations is a yaml object, and the annotation affects the markdown block that directly follows it in the document.

By leveraging comments to store annotations, Stoplight flavored markdown degrades gracefully to any other markdown renderer (Github, for example).

## Callouts

A callout is a md block quote with an optional annotation that indicates intent.

<!-- theme: danger -->

> ### **Danger Will Robinson!**
>
> Here is my danger callout!

<!-- theme: warning -->

> ### **Watch Out!**
>
> Here is my warning callout!

<!-- theme: success -->

> ### **Mission Accomplished!**
>
> Here is my success callout!

<!-- theme: info -->

> ### **A thing to know**
>
> Here is my info callout

#### Markdown Sample

```md
<!-- theme: danger -->

> ### **Danger Will Robinson!**
>
> Here is my danger callout!

<!-- theme: warning -->

> ### **Watch Out!**
>
> Here is my warning callout!

<!-- theme: success -->

> ### **Mission Accomplished!**
>
> Here is my success callout!

<!-- theme: info -->

> ### **A thing to know**
>
> Here is my info callout
```

## Code Blocks

A smd code block is md code fence with an optional annotation to tweak the presentation of the code block.

<!--
title: "My code snippet"
lineNumbers: true
highlightLines: [[1,2], [4,5]]
-->

```javascript
function fibonacci(num){
  var a = 1, b = 0, temp;

  while (num >= 0){
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
}
```

## JSON Schema

A smd json schema block is a md code block with a `json_schema` type annotation. The contents of the code fence should be the json schema object to be rendered.

<!-- theme: warning -->

> The example below uses a `json_schema` language tag rather than `json`. This will be fixed in a future release.

#### User

<!-- type: json_schema -->

```json_schema
{
  "title": "User",
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "description": "The user's full name."
    },
    "age": {
      "type": "number",
      "minimum": 0,
      "maximum": 150
    }    
  },
  "required": [
    "id",
    "name"
  ]
}
```

## Tabs

A smd tab container is a `tab` annotation, followed by the tab content, and closed by a final `tab-end` annotation.

<!-- theme: danger -->

> Tab containers cannot be nested.

<!--
type: tab
title: My First Tab
-->

The contents of tab 1.

<!--
type: tab
title: My Second Tab
-->

The contents of tab 2.

<!-- type: tab-end -->

#### Markdown Sample

```md
<!--
type: tab
title: My First Tab
-->

The contents of tab 1.

<!--
type: tab
title: My Second Tab
-->

The contents of tab 2.

<!-- type: tab-end -->
```

---

*FIN.*