#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require "rubygems"
require "nokogiri"
require "nkf"

module JE
  class JavaScript
    def initialize
      @file_in = File.dirname(__FILE__) + "/z.js"
      @file_out = @file_in.sub(/z.js$/, "z_en.js")
    end

    def start
      js = open(@file_in).read
      h = {
        "停止中" => "Pause",
        "発表残り時間" => "Talking",
        "質疑経過時間" => "Q&amp;A",
        "質疑時間超過" => "Overrun! Q&amp;A",
        "発表時間超過" => "Overrun! Talking",
        "停止中" => "Pause",
        "発表時間" => "Talking",
        "質疑時間" => "Q&amp;A",
        "質疑時間超過" => "Overrun! Q&amp;A",
        "発表時間超過" => "Overrun! Talking",
        "zjs: 発表時間はカウントダウン、質疑時間はカウントアップ" => "zjs: count-down mode while talking",
        "zjs: 発表・質疑の合計時間をカウントアップ" => "zjs: count-up mode",
        "再開" => "Resume",
        "開始" => "Start",
        "時間" => " hour ",
        "分" => " min ",
        "秒" => " sec ",
      }

      h.each_pair do |key0, value0|
        puts "key: #{key0}, value: #{value0}" if $DEBUG
        key = '"' + key0 + '"'
        value = '"' + value0 + '"'
        while js.index(key)
          js[key] = value
        end
      end

      open(@file_out, "w") do |f_out|
        f_out.print js
      end
    end
  end

  class HTMLe
    def initialize
      @file_in = File.dirname(__FILE__) + "/index0.html"
      @file_out = @file_in.sub(/index0.html$/, "index0_en.html")
    end

    def start
      n = Nokogiri.HTML(open(@file_in).read)

      # script file
      e = n.at("//script[@src='z.js']")
      e.set_attribute("src", "z_en.js")

      # labels of buttons
      h = {
        "buttonstart" => "Start",
        "buttonstop" => "Stop",
        "buttonreset" => "Reset",
        "Dbutton_getform" => "Set form",
        "Dbutton_setform" => "Revert form",
        "Dbutton_coundmode" => "Change count-up/down",
        "Dbutton_advice" => "Ready?",
        "Dbutton_readme" => "Read me first",
        "Dbutton_keybind" => "Shortcut keys",
        "Dbutton_log" => "Log",
        "Dbutton_ring1" => "Bell 1",
        "Dbutton_ring2" => "Bell 2",
        "Dbutton_ring3" => "Bell 3",
      }

      h.each_pair do |key, value|
        puts "key: #{key}, value: #{value}" if $DEBUG
        e = n.at('#' + key)
        e.set_attribute("value", value)
        if /^D/ =~ key
          e.remove_attribute("id")
        end
      end

      # words
      h = {
        "timestatus" => "Pause",
        "timeminlabel" => "min",
        "timeseclabel" => "sec",
        "Dlabel_talktime" => "Talk time",
        "Dcfgmin2" => "min",
        "Dcfgsec2" => "sec",
        "Dbellsort2" => " / Bell",
        "Dcfgwav20" => "None",
        "cfglabel0" => "Prior bell 1",
        "Dlabel_bell0" => "",
        "Dcfgmin0" => "min",
        "Dcfgsec0" => "sec <span style=\"font-size:75%\">before finishing talk</span>",
        "Dbellsort0" => " / Bell",
        "Dcfgwav00" => "None",
        "Dcfglabel1" => "Prior bell 2",
        "Dlabel_bell1" => "",
        "Dcfgmin1" => "min",
        "Dcfgsec1" => "sec <span style=\"font-size:75%\">before finishing talk</span>",
        "Dbellsort1" => " / Bell",
        "Dcfgwav10" => "None",
        "Dlabel_qa" => "Q&amp;A time",
        "Dcfgmin3" => "min",
        "Dcfgsec3" => "sec",
        "Dbellsort3" => " / Bell",
        "Dcfgwav30" => "None",
      }

      h.each_pair do |key, value|
        puts "key: #{key}, value: #{value}" if $DEBUG
        e = n.at('#' + key)
        e.inner_html = value
        if /^D/ =~ key
          e.remove_attribute("id")
        end
      end

      # keybinds
      h = {
        "Dkeybind_clock" => "Start, stop, or resume the clock.",
        "Dkeybind_reset" => "Reset the clock (by double-hit in pausing).",
        "Dkeybind_bell" => "Ring the bell (by double-hit).",
        "Dkeybind_shorten" => "Shorten the clock display.",
        "Dkeybind_enlarge" => "Enlarge the clock display.",
        "Dkeybind_magnify" => "Change the size of buttons and some components (in pausing).",
        "Dkeybind_keybind" => "Turn on/off the shortcut instruction.",
        "Dkeybind_countmode" => "Change the count-up/down mode.",
        "Dkeybind_readme" => "Turn on/off the readme.",
        "Dkeybind_hourglass" => "Change the hourglass mode.",
        "Dkeybind_log" => "Turn on/off the log (in pausing). Record the clock time (in counting). Use it at rehearsal.",
      }
      h.each_pair do |key, value|
        puts "key: #{key}, value: #{value}" if $DEBUG
        e = n.at('#' + key)
        e.replace(value)
      end

      # readme
      e = n.at("#readme")
      e.inner_html = <<'EOS'
<ul>
  <li>This is for managing the presenter's time on the second time scale. It is expected to be used in academic meetings or thesis defenses.</li>
  <li id="readme_key">You can use this timer not only by mouse but also by keyboard. It is ready for a numerical-keypad operation, too, but pay attention to Num Lock.</li>
  <li>When you push the "Reset" button above the control panel, the elapsed time is brought back to zero. If you would like to reflect your entries of the form, push the "Set form" button on the board. These operations are permitted only under suspension.</li>
  <li id="readmering">The HTML file itself works. But you can play the sounds or give the bell a ring if you have wav files.</li>
  <li id="iv_readmering" style="display:none">The HTML file itself works. But you can play the sounds or give the bell a ring, if you have wav files and change "ringMode: 0," of this file into "ringMode: null,".</li>
  <li>The initial character of "zjs" was named after "Zacho No Tomo" ("Chairperson's Companion", forcibly translated into English), a Windows application created by Mr. Tomohiko Imachi. I implemented the features of Zacho No Tomo by JavaScript at first, and have set in various useful functions from my own standpoint to be a comprehensive clock register.</li>
  <li>The latest and old versions of this file are available through <a href="http://github.com/takehiko/zjs/">GitHub</a>.</li>
</ul>
EOS

      # iv_keybind
      e = n.at("#iv_keybind")
      e.inner_html = "Keyboard operations are disabled."

      # advice
      e = n.at("#advice")
      e.inner_html = <<'EOS'
Please make sure the screen is not black or
a screen-saver does not start
after you do nothing for a number of minutes.
EOS

      open(@file_out, "w") do |f_out|
        f_out.print NKF.nkf("-w -Lw", n.to_html)
      end
    end
  end

  class HTMLj
    def initialize
      @file_in = File.dirname(__FILE__) + "/index0.html"
      @file_out = @file_in.sub(/index0.html$/, "index0_ja.html")
    end

    def start
      n = Nokogiri::HTML::Document.parse(open(@file_in).read, nil, "utf-8")

      n.search("//*[@id]").each do |e|
        id = e["id"]
        next if id.index("D") != 0
        tag = e.name
        if /span|div/i =~ tag && e.attribute_nodes.size == 1 && e.children.size == 1
          e.replace(e.child)
          # e.swap(t.inner_html)  # causes character curruption
          puts "#{id}: tag removed" if $DEBUG
        else
          e.remove_attribute("id")
          puts "#{id}: id removed" if $DEBUG
        end
      end

      open(@file_out, "w") do |f_out|
        f_out.print NKF.nkf("-w -Lw", n.to_html(:encoding => "utf-8"))
      end
    end
  end
end

if __FILE__ == $0
  case ARGV[0]
  when /^z/i
    JE::JavaScript.new.start
  when /^j/i
    JE::HTMLj.new.start
  when /^a/i
    JE::JavaScript.new.start
    JE::HTMLe.new.start
    JE::HTMLj.new.start
  else
    JE::HTMLe.new.start
  end
end
