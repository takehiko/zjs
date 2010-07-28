#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require "nkf"
require "optparse"

class Build
  def initialize(option)
    # コンストラクタ
    @input = option[:input]
    @output = option[:output]
    @compress = option[:compress]

    @@zjs_prop_h = {
      "config" => "g",
      "clock" => "k",
      "key" => "y",
      "board" => "d",
      "bell" => "l",
      "screen" => "n",
    }
    @@zjs_prop_r = Regexp.new("zjs\.(#{@@zjs_prop_h.keys.map{|k| '(' + k + ')'}.join('|')})")
  end

  def compress_zjs_property(str)
    # 「zjs.プロパティ」を圧縮してできる文字列を返す
    str.gsub(@@zjs_prop_r) {"z.#{@@zjs_prop_h[$1]}"}
  end
  private :compress_zjs_property

  def read_js(filename)
    # jsファイルを読み出し，@compressに応じて圧縮してできる文字列を返す
    js_in = open(filename).read
    js_out = ""

    js_in.each_line do |line|
      if @compress & 1 != 0
        # 1: 行頭空白4文字を1文字に
        line.sub!(/^( +)/) {spc = $1.length; " " * (spc / 4 + spc % 4)}
      end

      if @compress & 2 != 0 && /(zjs)|(prop)/ =~ line
        # 2: 「zjs」「zjs.プロパティ」「prop」を圧縮
        line = compress_zjs_property(line)
        line.gsub!(/\bprop\b/, "_")
        if /var zjs[ ;]/ =~ line
          line.sub!(/var zjs/, "var z")
        end
      end

      if @compress & 4 != 0
        # 4: コメント除去
        slash_pos = line.index("// ")
        if slash_pos && !line[slash_pos...line.length].index('"')
          line = line[0, slash_pos]
          next if /^\s*$/ =~ line
          line.sub!(/\s+$/, "")
          line += "\n"
        end
      end

      js_out += line
    end

    js_out
  end
  private :read_js

  def start
    # 変換処理の本体
    html_in = open(@input).read
    html_out = ""
    html_in.each_line do |line|
      if / src=\"(.*?)\.js\">/ =~ line
        js = $1 + ".js"
        html_out += $`
        html_out += ">\n"
        html_out += read_js(js)
        html_out += "</script>\n"
      else
        line = compress_zjs_property(line) if @compress & 2 != 0 && line.index("zjs")
        html_out += line
      end
    end
    html_out = NKF.nkf("-w -Lw", html_out)
    open(@output, "w") {|f_out| f_out.print html_out}
  end
end

if __FILE__ == $0
  def dirfile(dir, file)
    # ディレクトリ名dir，ファイル名file（からディレクトリ名を除いたもの）
    # としてファイル名を生成する
    if !(String === dir) || dir.empty?
      File.basename(file)
    else
      dir + "/" + File.basename(file)
    end
  end

  option = {
    :input => "index0.html",
    :output => "../index.html",
    :compress => 0
  }
  OptionParser.new do |opt|
    opt.on("-i VAL", "--input=VAL", 
           "input file name (default: #{option[:input]})") {|v|
      option[:input] = v
    }
    opt.on("-o VAL", "--output=VAL", 
           "output file name (default: #{option[:output]})") {|v|
      option[:output] = v
    }
    opt.on("-I VAL", "--input-dir=VAL", "input directory name") {|v|
      option[:input] = dirfile(v, option[:input])
    }
    opt.on("-O VAL", "--output-dir=VAL", "output directory name") {|v|
      option[:output] = dirfile(v, option[:output])
    }
    opt.on("-c VAL", "--compress=VAL",
           "compression level") {|v|
      option[:compress] = v.to_i
    }

    opt.parse!(ARGV)
  end

  Build.new(option).start
end
