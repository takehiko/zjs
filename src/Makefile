all: ../zjs.html ../zjs_ja.html

../zjs.html: index0_en.html build.rb
	ruby build.rb -i index0_en.html -o ../zjs.html -c 4

../zjs_ja.html: index0_ja.html build.rb
	ruby build.rb -i index0_ja.html -o ../zjs_ja.html

7.html: index0_ja.html build.rb
	ruby build.rb -i index0_ja.html -o 7.html -c 7

index0_en.html: index0.html z_en.js je.rb
	ruby je.rb

index0_ja.html: index0.html z.js je.rb
	ruby je.rb j

z_en.js: z.js je.rb
	ruby je.rb z
