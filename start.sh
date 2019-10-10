#!/bin/bash
rm ./site/ -rfv
rm ./.jekyll-cache/ -rfv
jekyll serve --baseurl "" --watch