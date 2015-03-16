class Admin::LicencesController < AdminController
  before_action :set_admin_licence, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @admin_licences = Admin::Licence.all
    respond_with(@admin_licences)
  end

  def show
    respond_with(@admin_licence)
  end

  def new
    @admin_licence = Admin::Licence.new
    respond_with(@admin_licence)
  end

  def edit
  end

  def create
    @admin_licence = Admin::Licence.new(licence_params)
    @admin_licence.save
    respond_to do |format|
      format.html { redirect_to admin_licences_path, notice: 'Licence was successfully created.' }
    end
    # respond_with(@admin_licence)
  end

  def update
    @admin_licence.update(licence_params)
    # respond_with(@admin_licence)
    respond_to do |format|
      format.html { redirect_to admin_licences_path, notice: 'Licence was successfully created.' }
    end
  end

  def destroy
    @admin_licence.destroy
    respond_with(@admin_licence)
  end

  private
    def set_admin_licence
      @admin_licence = Admin::Licence.find(params[:id])
    end

    def licence_params
      params.require(:admin_licence).permit(:name)
    end
end
