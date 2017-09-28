export function sourceUrlToBookmark(sourceUrl: string): string {
  return `(a=>{var b=document.createElement('script');b.src=a,b.type='text/javascript',(document.head||document.getElementsByTagName('head')[0]).appendChild(b)})('${sourceUrl}');`;
}
