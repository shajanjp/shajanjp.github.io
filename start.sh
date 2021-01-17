#!/bin/bash
rm ./site/ -rfv
rm ./.jekyll-cache/ -rfv
jekyll serve --baseurl "" --watch --host=0.0.0.0