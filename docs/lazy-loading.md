# Lazy loading translation

If you are developing a large app, you can consider using lazy loading translation: translations that are lazy loaded only when requested (when the user navigates to a specific section or page of the app):

```mermaid
C4Container
  Container_Boundary(a, "App") {
    Component(a0, "root", "useQwikSpeak", "Translations available in the whole app")
    Container_Boundary(b1, "Site") {
      Component(b10, "Page", "useSpeak", "Translations available in Page component")        

    }  
    Container_Boundary(b2, "Admin") {
      Component(b20, "layout", "useSpeak", "Translations available in child components")        
    }
  }
```

For lazy loading of files in a specific section, you need to add `useSpeak` to the layout:
```tsx
import { useSpeak } from 'qwik-speak';

export default component$(() => {
  useSpeak({assets:['admin'], runtimeAssets: ['runtimeAdmin']});
  
  return (
    <>
      <main>
        <Slot />
      </main>
    </>
  );
});
```
or in a specific page:
```tsx
export default component$(() => {
  useSpeak({runtimeAssets: ['runtimePage']});

  return <Page />;
});
```
> Note that you must create a component for the page, because Qwik renders components in isolation, and translations are only available in child components