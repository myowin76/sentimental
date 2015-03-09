class AdminController < ApplicationController
	before_action :authenticate_user!, :except => [:show]
	layout 'admin'
  def dashboard


  end
end
