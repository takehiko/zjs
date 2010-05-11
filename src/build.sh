#!/bin/sh

IN=index0.html
OUT=../zjs.html
#OUT=zjs.html

ruby -Ku -pe "if / src=.(.*?).>/ then print \$\`; puts '>'; print open(\$1).read; \$_=\"</script>\\n\"; end" $IN | nkf -w -Lw > $OUT
